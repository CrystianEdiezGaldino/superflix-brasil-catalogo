export interface UserWithSubscription {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  is_admin: boolean;
  last_sign_in_at?: string | null;
  subscription?: {
    id: string;
    user_id: string;
    plan_type: 'monthly' | 'yearly';
    status: 'active' | 'inactive';
    created_at: string;
    expires_at: string;
    current_period_start: string;
    current_period_end: string;
  };
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  uses: number;
  active: boolean;
  created_at: string;
  expires_at: string;
  usage_limit: number;
  usage_count: number;
  created_by: string;
  description: string;
  discount: number;
  is_active: boolean;
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
