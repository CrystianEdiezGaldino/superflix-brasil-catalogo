
import { AdminStats, PromoCode, TempAccess, User } from "@/types/admin";

// Simular dados para o painel administrativo
const mockUsers: User[] = [
  {
    id: "1",
    email: "usuario1@exemplo.com",
    name: "Usuário 1",
    role: "user",
    status: "active",
    createdAt: "2025-02-15T10:30:00Z",
    hasSubscription: true,
    subscriptionEnd: "2025-06-15T10:30:00Z"
  },
  {
    id: "2",
    email: "usuario2@exemplo.com",
    name: "Usuário 2",
    role: "user",
    status: "active",
    createdAt: "2025-03-10T14:45:00Z",
    hasSubscription: false,
    subscriptionEnd: null
  },
  {
    id: "3",
    email: "admin@exemplo.com",
    name: "Administrador",
    role: "admin",
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
    hasSubscription: true,
    subscriptionEnd: null // Acesso permanente
  }
];

const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "WELCOME25",
    discount: 25,
    validUntil: "2025-07-01T23:59:59Z",
    maxUses: 100,
    usedCount: 45,
    status: "active"
  },
  {
    id: "2",
    code: "SUMMER50",
    discount: 50,
    validUntil: "2025-08-31T23:59:59Z",
    maxUses: 50,
    usedCount: 10,
    status: "active"
  }
];

const mockTempAccesses: TempAccess[] = [
  {
    id: "1",
    userId: "4",
    userEmail: "temp1@exemplo.com",
    grantedBy: "3",
    grantedAt: "2025-04-01T10:00:00Z",
    expiresAt: "2025-04-08T10:00:00Z",
    status: "active"
  },
  {
    id: "2",
    userId: "5",
    userEmail: "temp2@exemplo.com",
    grantedBy: "3",
    grantedAt: "2025-04-02T14:30:00Z",
    expiresAt: "2025-04-09T14:30:00Z",
    status: "expired"
  }
];

// Funções para obter os dados simulados
export const getUsers = async (): Promise<User[]> => {
  // Simulando delay de rede
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
    activeSubscriptions: mockUsers.filter(user => user.hasSubscription).length,
    tempAccesses: mockTempAccesses.filter(access => access.status === "active").length,
    promoCodes: mockPromoCodes.length,
    adminUsers: mockUsers.filter(user => user.role === "admin").length,
    monthlyRevenue: 2500.00,
    yearlyRevenue: 15000.00
  };
};

// Função para criar um novo código promocional
export const createPromoCode = async (promoCode: Omit<PromoCode, "id" | "usedCount" | "status">): Promise<PromoCode> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newPromoCode: PromoCode = {
    id: `${mockPromoCodes.length + 1}`,
    ...promoCode,
    usedCount: 0,
    status: "active"
  };
  
  mockPromoCodes.push(newPromoCode);
  return newPromoCode;
};

// Função para conceder acesso temporário
export const grantTempAccess = async (tempAccess: Omit<TempAccess, "id" | "grantedAt" | "status">): Promise<TempAccess> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newTempAccess: TempAccess = {
    id: `${mockTempAccesses.length + 1}`,
    ...tempAccess,
    grantedAt: new Date().toISOString(),
    status: "active"
  };
  
  mockTempAccesses.push(newTempAccess);
  return newTempAccess;
};
