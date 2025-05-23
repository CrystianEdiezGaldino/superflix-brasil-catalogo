
import { supabase } from "@/integrations/supabase/client";
import { AdminStats, UserWithSubscription } from "@/types/admin";

export async function fetchAdminData() {
  try {
    // Get user roles to identify admins
    const { data: userRolesData, error: userRolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (userRolesError) {
      console.error("Error fetching user roles:", userRolesError);
      throw userRolesError;
    }
    
    // Get all profiles
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
    
    // Get auth users
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
    const combinedUsers = userData.map((user: any): UserWithSubscription => {
      const subscription = subscriptionsData?.find((sub: any) => sub.user_id === user.id);
      const tempAccess = tempAccessesData?.find(
        (access: any) => access.user_id === user.id && new Date(access.expires_at) > new Date()
      );
      const isAdmin = adminsMap.has(user.id);
      const profile = profilesMap.get(user.id);
      
      // Format subscription data to match required types
      const formattedSubscription = subscription ? {
        id: subscription.id,
        user_id: subscription.user_id,
        status: subscription.status as "active" | "trialing" | "inactive",
        plan_type: subscription.plan_type,
        created_at: subscription.created_at,
        expires_at: subscription.current_period_end, // Add expires_at field
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        trial_end: subscription.trial_end
      } : undefined;

      // Format temp_access to match the required type
      const formattedTempAccess = tempAccess ? {
        id: tempAccess.id,
        user_id: tempAccess.user_id,
        expires_at: tempAccess.expires_at,
        granted_by: tempAccess.granted_by,
        is_active: true, // Add the missing is_active property
        created_at: tempAccess.created_at,
        start_date: tempAccess.created_at,
        end_date: tempAccess.expires_at
      } : undefined;
      
      return {
        id: user.id,
        email: user.email || '',
        name: user.email || '',
        last_sign_in_at: user.last_sign_in_at,
        created_at: user.created_at || profile?.created_at,
        is_admin: isAdmin,
        subscription: formattedSubscription,
        temp_access: formattedTempAccess
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
    const activeSubscriptions = subscriptionsData?.filter((sub: any) => sub.status === 'active') || [];
    const activeTempAccesses = tempAccessesData?.filter(
      (access: any) => new Date(access.expires_at) > new Date()
    ) || [];
    const adminUsersCount = adminsMap.size || 0;
    
    const monthlyRevenue = activeSubscriptions.filter((sub: any) => sub.plan_type === 'monthly').length * 9.9;
    const annualRevenue = activeSubscriptions.filter((sub: any) => sub.plan_type === 'annual').length * (100 / 12);
    
    const stats: AdminStats = {
      totalUsers: allProfiles?.length || 0,
      activeSubscriptions: activeSubscriptions.length,
      tempAccess: activeTempAccesses.length,
      promoCodes: 0, // Default value
      adminUsers: adminUsersCount,
      monthlyRevenue: monthlyRevenue + annualRevenue,
      yearlyRevenue: (monthlyRevenue + annualRevenue) * 12
    };

    return {
      users: combinedUsers,
      subscriptions: subscriptionsData || [],
      tempAccess: activeTempAccesses || [],
      stats
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
}
