
import { supabase } from "@/integrations/supabase/client";
import { AdminStats, UserWithSubscription } from "@/types/admin";

export async function fetchAdminData() {
  try {
    // Get all users with improved error handling
    const { data: authData, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Error fetching users:", usersError);
      throw usersError;
    }

    // Get user roles to identify admins
    const { data: userRolesData, error: userRolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (userRolesError) {
      console.error("Error fetching user roles:", userRolesError);
      throw userRolesError;
    }
    
    // Get all subscriptions
    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*');
    
    if (subscriptionsError) {
      console.error("Error fetching subscriptions:", subscriptionsError);
      throw subscriptionsError;
    }
    
    // Get all temp accesses
    const { data: tempAccessesData, error: tempAccessesError } = await supabase
      .from('temp_access')
      .select('*');
    
    if (tempAccessesError) {
      console.error("Error fetching temp access:", tempAccessesError);
      throw tempAccessesError;
    }
    
    // Create an admin users map for quick lookups
    const adminsMap = new Map();
    if (userRolesData) {
      userRolesData.forEach((role: any) => {
        if (role.role === 'admin') {
          adminsMap.set(role.user_id, true);
        }
      });
    }
    
    // Combine user data with subscription and admin data
    const usersData = authData?.users || [];
    const combinedUsers: UserWithSubscription[] = usersData.map(user => {
      const subscription = subscriptionsData?.find(sub => sub.user_id === user.id);
      const tempAccess = tempAccessesData?.find(
        access => access.user_id === user.id && new Date(access.expires_at) > new Date()
      );
      const isAdmin = adminsMap.has(user.id);
      
      return {
        id: user.id,
        email: user.email || '',
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at,
        subscription: subscription,
        temp_access: tempAccess,
        is_admin: isAdmin
      };
    });
    
    // Calculate stats
    const activeSubscriptions = subscriptionsData?.filter(sub => sub.status === 'active') || [];
    const activeTempAccesses = tempAccessesData?.filter(
      access => new Date(access.expires_at) > new Date()
    ) || [];
    const adminUsersCount = adminsMap.size;
    
    const monthlyRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'monthly').length * 9.9;
    const annualRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'annual').length * (100 / 12);
    
    const stats: AdminStats = {
      totalUsers: usersData.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      tempAccesses: activeTempAccesses.length,
      adminUsers: adminUsersCount,
      monthlyRevenue: monthlyRevenue + annualRevenue,
      yearlyRevenue: (monthlyRevenue + annualRevenue) * 12
    };

    return {
      users: combinedUsers,
      subscriptions: subscriptionsData || [],
      tempAccesses: tempAccessesData || [],
      stats
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
}
