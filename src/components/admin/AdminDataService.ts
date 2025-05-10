
import { supabase } from "@/integrations/supabase/client";
import { AdminStats, UserWithSubscription } from "@/types/admin";

export async function fetchAdminData() {
  try {
    // Get user roles to identify admins - this works with regular permissions
    const { data: userRolesData, error: userRolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (userRolesError) {
      console.error("Error fetching user roles:", userRolesError);
      throw userRolesError;
    }
    
    // Get all profiles instead of using auth.admin.listUsers
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
      throw profilesError;
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
    
    // Get auth users - we'll now use the check-subscription edge function to get auth data
    const { data: authData, error: authError } = await supabase.functions.invoke('check-subscription');
    
    if (authError) {
      console.error("Error fetching auth data:", authError);
      throw authError;
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
    
    // Create a map of profiles by user ID for quick lookups
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach((profile: any) => {
        profilesMap.set(profile.id, profile);
      });
    }
    
    // Combine user data with subscription and admin data
    const userData = authData?.user ? [authData.user] : [];
    const combinedUsers: UserWithSubscription[] = userData.map((user: any) => {
      const subscription = subscriptionsData?.find(sub => sub.user_id === user.id);
      const tempAccess = tempAccessesData?.find(
        access => access.user_id === user.id && new Date(access.expires_at) > new Date()
      );
      const isAdmin = adminsMap.has(user.id);
      const profile = profilesMap.get(user.id);
      
      return {
        id: user.id,
        email: user.email || '',
        name: user.email || '', // Using email as name if not available
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at || profile?.created_at,
        updated_at: user.updated_at || profile?.updated_at || user.created_at || new Date().toISOString(),
        subscription: subscription,
        temp_access: tempAccess,
        is_admin: isAdmin
      };
    });
    
    // Get all users from the database
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        created_at
      `);
    
    if (allProfilesError) {
      console.error("Error fetching all profiles:", allProfilesError);
      throw allProfilesError;
    }
    
    // Calculate stats
    const activeSubscriptions = subscriptionsData?.filter(sub => sub.status === 'active') || [];
    const activeTempAccesses = tempAccessesData?.filter(
      access => new Date(access.expires_at) > new Date()
    ) || [];
    const adminUsersCount = adminsMap.size || 0;
    
    const monthlyRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'monthly').length * 9.9;
    const annualRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'annual').length * (100 / 12);
    
    const stats: AdminStats = {
      totalUsers: allProfiles?.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      tempAccesses: activeTempAccesses.length,
      promoCodes: 0, // Default value
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
