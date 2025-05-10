export interface UserWithSubscription {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription?: Subscription;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  tempAccesses: number;
  promoCodes: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: 'active' | 'inactive';
  current_period_start: string;
  current_period_end: string;
  start_date: string;
  end_date: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_end?: string;
  created_at: string;
  updated_at: string;
  user?: UserWithSubscription;
}

export interface TempAccess {
  id: string;
  user_id: string;
  granted_by: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  user?: UserWithSubscription;
}

export interface PromoCode {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  expires_at: string;
  usage_limit: number;
  usage_count: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
}
