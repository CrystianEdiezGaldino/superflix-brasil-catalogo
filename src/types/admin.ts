
export interface UserWithSubscription {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  subscription?: Subscription;
  temp_access?: TempAccess;
  last_sign_in_at?: string;
  is_admin?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  tempAccesses: number;
  promoCodes: number;
  adminUsers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  status: 'active' | 'inactive';
  current_period_start: string | null;
  current_period_end: string | null;
  start_date: string;
  end_date: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  trial_end?: string | null;
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
  expires_at: string;
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
