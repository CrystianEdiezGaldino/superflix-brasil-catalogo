
import { AdminStats, PromoCode, TempAccess, UserWithSubscription } from "@/types/admin";
import { fetchAdminData as fetchAdminDataFromService } from "@/components/admin/AdminDataService";

// Export the fetchAdminData function from the AdminDataService
export { fetchAdminDataFromService as fetchAdminData };

// Simular dados para o painel administrativo
const mockUsers: UserWithSubscription[] = [
  {
    id: "1",
    email: "usuario1@exemplo.com",
    name: "Usuário 1",
    created_at: "2025-02-15T10:30:00Z",
    updated_at: "2025-02-15T10:30:00Z",
    is_admin: false,
    subscription: {
      id: "sub_1",
      user_id: "1",
      plan_type: "premium",
      status: "active",
      current_period_start: "2025-02-15T10:30:00Z",
      current_period_end: "2025-06-15T10:30:00Z",
      start_date: "2025-02-15T10:30:00Z",
      end_date: "2025-06-15T10:30:00Z",
      created_at: "2025-02-15T10:30:00Z",
      updated_at: "2025-02-15T10:30:00Z"
    }
  },
  {
    id: "2",
    email: "usuario2@exemplo.com",
    name: "Usuário 2",
    created_at: "2025-03-10T14:45:00Z",
    updated_at: "2025-03-10T14:45:00Z",
    is_admin: false
  },
  {
    id: "3",
    email: "admin@exemplo.com",
    name: "Administrador",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    is_admin: true,
    subscription: {
      id: "sub_3",
      user_id: "3",
      plan_type: "admin",
      status: "active",
      current_period_start: "2025-01-01T00:00:00Z",
      current_period_end: null,
      start_date: "2025-01-01T00:00:00Z",
      end_date: "2099-12-31T23:59:59Z",
      created_at: "2025-01-01T00:00:00Z",
      updated_at: "2025-01-01T00:00:00Z"
    }
  }
];

const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "WELCOME25",
    discount: 25,
    type: "percentage",
    expires_at: "2025-07-01T23:59:59Z",
    usage_limit: 100,
    usage_count: 45,
    is_active: true,
    created_by: "3",
    created_at: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    code: "SUMMER50",
    discount: 50,
    type: "percentage",
    expires_at: "2025-08-31T23:59:59Z",
    usage_limit: 50,
    usage_count: 10,
    is_active: true,
    created_by: "3",
    created_at: "2025-01-01T00:00:00Z"
  }
];

const mockTempAccesses: TempAccess[] = [
  {
    id: "1",
    user_id: "4",
    granted_by: "3",
    start_date: "2025-04-01T10:00:00Z",
    end_date: "2025-04-08T10:00:00Z",
    is_active: true,
    created_at: "2025-04-01T10:00:00Z",
    expires_at: "2025-04-08T10:00:00Z"
  },
  {
    id: "2",
    user_id: "5",
    granted_by: "3",
    start_date: "2025-04-02T14:30:00Z",
    end_date: "2025-04-09T14:30:00Z",
    is_active: false,
    created_at: "2025-04-02T14:30:00Z",
    expires_at: "2025-04-09T14:30:00Z"
  }
];

// Funções para obter os dados simulados
export const getUsers = async (): Promise<UserWithSubscription[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockUsers];
};

export const getPromoCodes = async (): Promise<PromoCode[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...mockPromoCodes];
};

export const getTempAccesses = async (): Promise<TempAccess[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return [...mockTempAccesses];
};

export const getAdminStats = async (): Promise<AdminStats> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    totalUsers: mockUsers.length,
    activeSubscriptions: mockUsers.filter(user => user.subscription?.status === "active").length,
    tempAccesses: mockTempAccesses.filter(access => access.is_active).length,
    promoCodes: mockPromoCodes.length,
    adminUsers: mockUsers.filter(user => user.is_admin).length,
    monthlyRevenue: 2500.00,
    yearlyRevenue: 15000.00
  };
};

// Função para criar um novo código promocional
export const createPromoCode = async (promoCode: Omit<PromoCode, "id" | "usage_count" | "created_at" | "is_active">): Promise<PromoCode> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newPromoCode: PromoCode = {
    id: `${mockPromoCodes.length + 1}`,
    ...promoCode,
    usage_count: 0,
    created_at: new Date().toISOString(),
    is_active: true
  };
  
  mockPromoCodes.push(newPromoCode);
  return newPromoCode;
};

// Função para conceder acesso temporário
export const grantTempAccess = async (tempAccess: Omit<TempAccess, "id" | "created_at" | "is_active">): Promise<TempAccess> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newTempAccess: TempAccess = {
    id: `${mockTempAccesses.length + 1}`,
    ...tempAccess,
    created_at: new Date().toISOString(),
    is_active: true
  };
  
  mockTempAccesses.push(newTempAccess);
  return newTempAccess;
};
