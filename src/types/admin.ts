
export interface UserWithSubscription {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  is_admin: boolean;
  last_sign_in_at?: string | null;
  temp_access?: {
    id: string;
    user_id: string;
    expires_at: string;
    granted_by: string;
    is_active: boolean;
  };
  subscription?: {
    id: string;
    user_id: string;
    plan_type: string;
    status: 'active' | 'trialing' | 'inactive';
    created_at: string;
    expires_at?: string;
    current_period_start: string | null;
    current_period_end: string | null;
    trial_end?: string | null;
  };
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
  uses: number;
  active: boolean;
  is_active: boolean;
  created_at: string;
  expires_at: string;
  usage_limit: number;
  usage_count: number;
  created_by: string;
  description: string;
}

export interface TempAccess {
  id: string;
  user_id: string;
  created_at: string;
  expires_at: string;
  granted_by: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  tempAccess: number;
  promoCodes: number;
  adminUsers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}
