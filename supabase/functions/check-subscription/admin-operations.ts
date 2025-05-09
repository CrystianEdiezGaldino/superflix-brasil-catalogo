
// Create or update admin subscription
export const updateAdminSubscription = async (supabaseClient: any, userId: string, isAdmin: boolean) => {
  if (!isAdmin) return;
  
  try {
    // Check if admin already has a subscription
    const { data: existingAdminSub } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingAdminSub) {
      const now = new Date();
      // Create admin subscription if not exists
      const { error: createError } = await supabaseClient
        .from('subscriptions')
        .insert({
          user_id: userId,
          status: 'active',
          plan_type: 'admin',
          current_period_end: new Date(now.getFullYear() + 10, now.getMonth(), now.getDate()).toISOString(),
        });
      
      if (createError) {
        console.error('[CHECK-SUBSCRIPTION] Error updating admin subscription:', createError);
      } else {
        console.log('[CHECK-SUBSCRIPTION] Created admin subscription');
      }
    }
  } catch (error) {
    console.error('[CHECK-SUBSCRIPTION] Error updating admin subscription:', error);
  }
};

// Fetch all auth users (for admin users)
export const getAuthUsers = async (supabaseClient: any, isAdmin: boolean) => {
  if (!isAdmin) return null;
  
  const { data: authUsers, error: authUsersError } = await supabaseClient.auth.admin.listUsers();
  if (authUsersError) {
    console.error("[CHECK-SUBSCRIPTION] Error fetching auth users:", authUsersError);
    return null;
  }
  
  return authUsers;
};
