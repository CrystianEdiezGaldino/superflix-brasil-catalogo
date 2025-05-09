
export interface UserWithSubscription {
  id: string;
  email: string;
  last_sign_in_at?: string;
  created_at: string;
  subscription?: {
    status: string;
    plan_type?: string;
    current_period_end?: string;
  };
  temp_access?: {
    expires_at: string;
  };
  is_admin?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeSubscriptions: number;
  tempAccesses: number;
  adminUsers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}
