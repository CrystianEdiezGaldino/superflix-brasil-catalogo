
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
  // Fix: Especificamente buscando por assinaturas com status "active"
  const { data: subscription, error: subscriptionError } = await supabaseClient
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();
  
  if (subscriptionError) {
    console.error("[CHECK-SUBSCRIPTION] Subscription check error:", subscriptionError);
  }
  
  console.log(`[CHECK-SUBSCRIPTION] Active subscription check result - ${JSON.stringify({
    hasActiveSubscription: !!subscription,
    status: subscription?.status,
    planType: subscription?.plan_type
  })}`);
  
  return { subscription, error: subscriptionError };
};

// Check for trial access
export const checkTrialAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  
  // Fix: Melhoramos a query para pegar explicitamente assinaturas em período de teste
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

  const hasTrialAccess = subscriptionWithTrial && new Date(subscriptionWithTrial.trial_end) > now;
  console.log(`[CHECK-SUBSCRIPTION] Trial access check - ${JSON.stringify({
    hasTrialAccess: !!hasTrialAccess,
    trialEnd: subscriptionWithTrial?.trial_end,
    now: now.toISOString()
  })}`);
  
  return { subscriptionWithTrial, error: trialError };
};

// Check for temporary access
export const checkTempAccess = async (supabaseClient: any, userId: string) => {
  const now = new Date();
  
  // Fix: Melhoramos a query para garantir que apenas acessos temporários válidos sejam considerados
  const { data: tempAccess, error: tempAccessError } = await supabaseClient
    .from('temp_access')
    .select('*')
    .eq('user_id', userId)
    .gt('expires_at', now.toISOString())
    .maybeSingle();
  
  if (tempAccessError) {
    console.error("[CHECK-SUBSCRIPTION] Temp access check error:", tempAccessError);
  }

  const hasTempAccess = tempAccess && new Date(tempAccess.expires_at) > now;
  console.log(`[CHECK-SUBSCRIPTION] Temp access check - ${JSON.stringify({
    hasTempAccess: !!hasTempAccess, 
    expiresAt: tempAccess?.expires_at,
    now: now.toISOString()
  })}`);
  
  return { tempAccess, error: tempAccessError };
};
