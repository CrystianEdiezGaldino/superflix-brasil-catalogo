
// Check if user is admin
export const checkAdminStatus = async (supabaseClient: any, userId: string) => {
  const { data: adminData, error: adminError } = await supabaseClient
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  const isAdmin = !adminError && adminData;
  console.log(`[CHECK-SUBSCRIPTION] Admin check - ${JSON.stringify({isAdmin: !!isAdmin})}`);
  
  return isAdmin;
};

// Check for active subscription
export const checkSubscription = async (supabaseClient: any, userId: string) => {
  const { data: subscription, error: subscriptionError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (subscriptionError) {
    console.error("[CHECK-SUBSCRIPTION] Subscription check error:", subscriptionError);
  }
  
  console.log(`[CHECK-SUBSCRIPTION] Subscription check result - ${JSON.stringify({hasSubscription: !!subscription})}`);
  
  return { subscription, error: subscriptionError };
};

// Check for trial access
export const checkTrialAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  const { data: subscriptionWithTrial, error: trialError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'trialing')
    .gt('trial_end', now.toISOString())
    .maybeSingle();
  
  if (trialError) {
    console.error("[CHECK-SUBSCRIPTION] Trial check error:", trialError);
  }

  const hasTrialAccess = !trialError && subscriptionWithTrial;
  console.log(`[CHECK-SUBSCRIPTION] Trial access check - ${JSON.stringify({
    hasTrialAccess: !!hasTrialAccess,
    trialData: subscriptionWithTrial
  })}`);
  
  return { subscriptionWithTrial, error: trialError };
};

// Check for temporary access
export const checkTempAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  const { data: tempAccess, error: tempAccessError } = await supabaseClient
    .from('temp_access')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', now.toISOString())
    .maybeSingle();
  
  if (tempAccessError) {
    console.error("[CHECK-SUBSCRIPTION] Temp access check error:", tempAccessError);
  }

  const hasTempAccess = !tempAccessError && tempAccess;
  console.log(`[CHECK-SUBSCRIPTION] Temp access check - ${JSON.stringify({hasTempAccess: !!hasTempAccess})}`);
  
  return { tempAccess, error: tempAccessError };
};
