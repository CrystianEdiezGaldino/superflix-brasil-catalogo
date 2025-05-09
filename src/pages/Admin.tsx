
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Users, UserCheck, DollarSign, CalendarClock, CreditCard, Search } from "lucide-react";

interface UserWithSubscription {
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

const Admin = () => {
  const { isAdmin, isLoading: isSubscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tempAccesses, setTempAccesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [tempAccessDays, setTempAccessDays] = useState(30);
  const [isGranting, setIsGranting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    tempAccesses: 0,
    adminUsers: 0,
    monthlyRevenue: 0,
    yearlyRevenue: 0
  });

  // Fetch users and subscription data
  useEffect(() => {
    if (isSubscriptionLoading) return;
    
    if (!isAdmin) {
      toast.error("Área restrita a administradores");
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get all users with improved error handling
        const { data: authData, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (usersError) {
          console.error("Error fetching users:", usersError);
          throw usersError;
        }

        // Get user roles to identify admins
        const { data: userRolesData, error: userRolesError } = await supabase
          .from('user_roles')
          .select('*');
        
        if (userRolesError) {
          console.error("Error fetching user roles:", userRolesError);
          throw userRolesError;
        }
        
        // Get all subscriptions
        const { data: subscriptionsData, error: subscriptionsError } = await supabase
          .from('subscriptions')
          .select('*');
        
        if (subscriptionsError) {
          console.error("Error fetching subscriptions:", subscriptionsError);
          throw subscriptionsError;
        }
        
        // Get all temp accesses
        const { data: tempAccessesData, error: tempAccessesError } = await supabase
          .from('temp_access')
          .select('*');
        
        if (tempAccessesError) {
          console.error("Error fetching temp access:", tempAccessesError);
          throw tempAccessesError;
        }
        
        setSubscriptions(subscriptionsData || []);
        setTempAccesses(tempAccessesData || []);
        
        // Create an admin users map for quick lookups
        const adminsMap = new Map();
        if (userRolesData) {
          userRolesData.forEach((role: any) => {
            if (role.role === 'admin') {
              adminsMap.set(role.user_id, true);
            }
          });
        }
        
        // Combine user data with subscription and admin data
        const usersData = authData?.users || [];
        const combinedUsers: UserWithSubscription[] = usersData.map(user => {
          const subscription = subscriptionsData?.find(sub => sub.user_id === user.id);
          const tempAccess = tempAccessesData?.find(
            access => access.user_id === user.id && new Date(access.expires_at) > new Date()
          );
          const isAdmin = adminsMap.has(user.id);
          
          return {
            id: user.id,
            email: user.email || '',
            last_sign_in_at: user.last_sign_in_at,
            created_at: user.created_at,
            subscription: subscription,
            temp_access: tempAccess,
            is_admin: isAdmin
          };
        });
        
        setUsers(combinedUsers);
        
        // Calculate stats
        const activeSubscriptions = subscriptionsData?.filter(sub => sub.status === 'active') || [];
        const activeTempAccesses = tempAccessesData?.filter(
          access => new Date(access.expires_at) > new Date()
        ) || [];
        const adminUsersCount = adminsMap.size;
        
        const monthlyRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'monthly').length * 9.9;
        const annualRevenue = activeSubscriptions.filter(sub => sub.plan_type === 'annual').length * (100 / 12);
        
        setStats({
          totalUsers: usersData.length || 0,
          activeSubscriptions: activeSubscriptions.length,
          tempAccesses: activeTempAccesses.length,
          adminUsers: adminUsersCount,
          monthlyRevenue: monthlyRevenue + annualRevenue,
          yearlyRevenue: (monthlyRevenue + annualRevenue) * 12
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast.error('Erro ao carregar dados administrativos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, isSubscriptionLoading, navigate]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Grant temporary access to a user
  const grantTempAccess = async () => {
    if (!selectedUser) return;
    
    setIsGranting(true);
    try {
      const { data, error } = await supabase.functions.invoke('grant-temp-access', {
        body: {
          userId: selectedUser.id,
          days: tempAccessDays
        }
      });
      
      if (error) throw error;
      
      toast.success(`Acesso temporário concedido por ${tempAccessDays} dias`);
      
      // Update user list with new temp access
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { 
              ...user, 
              temp_access: { 
                expires_at: new Date(Date.now() + tempAccessDays * 24 * 60 * 60 * 1000).toISOString() 
              } 
            } 
          : user
      ));
      
      // Update stats
      setStats({
        ...stats,
        tempAccesses: stats.tempAccesses + 1
      });
    } catch (error) {
      console.error('Error granting temp access:', error);
      toast.error('Erro ao conceder acesso temporário');
    } finally {
      setIsGranting(false);
    }
  };

  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <div className="container max-w-full pt-20 pb-20 px-4">
        <h1 className="text-3xl font-bold text-white mb-6">Painel Administrativo</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <Users size={16} />
                Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <UserCheck size={16} />
                Admins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.adminUsers}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <CreditCard size={16} />
                Assinaturas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <CalendarClock size={16} />
                Acessos Temp.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.tempAccesses}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <DollarSign size={16} />
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R${stats.monthlyRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400 flex items-center gap-2">
                <DollarSign size={16} />
                Receita Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R${stats.yearlyRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4 bg-gray-800">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="temp_access">Acessos Temporários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <div className="relative w-full max-w-xs">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Buscar por email..." 
                      className="pl-10 bg-gray-700 border-gray-600"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Data de Registro</th>
                        <th className="text-left p-2">Último Login</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Perfil</th>
                        <th className="text-left p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center p-4 text-gray-400">
                            {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-700">
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              {new Date(user.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="p-2">
                              {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR') : 'Nunca'}
                            </td>
                            <td className="p-2">
                              {user.subscription?.status === 'active' ? (
                                <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                                  Assinante {user.subscription?.plan_type === 'monthly' ? 'Mensal' : 'Anual'}
                                </span>
                              ) : user.temp_access ? (
                                <span className="bg-yellow-600 text-white px-2 py-1 rounded-full text-xs">
                                  Acesso Temp. até {new Date(user.temp_access.expires_at).toLocaleDateString('pt-BR')}
                                </span>
                              ) : (
                                <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                                  Sem Assinatura
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              {user.is_admin ? (
                                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                                  Administrador
                                </span>
                              ) : (
                                <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs">
                                  Usuário
                                </span>
                              )}
                            </td>
                            <td className="p-2">
                              <Sheet>
                                <SheetTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedUser(user)}
                                  >
                                    Conceder Acesso
                                  </Button>
                                </SheetTrigger>
                                <SheetContent className="bg-gray-900 text-white">
                                  <SheetHeader>
                                    <SheetTitle className="text-white">Conceder Acesso Temporário</SheetTitle>
                                  </SheetHeader>
                                  <div className="py-6 space-y-4">
                                    <div>
                                      <p className="mb-2">Usuário:</p>
                                      <p className="font-bold">{selectedUser?.email}</p>
                                    </div>
                                    <div>
                                      <p className="mb-2">Dias de acesso:</p>
                                      <Input
                                        type="number"
                                        value={tempAccessDays}
                                        onChange={(e) => setTempAccessDays(Number(e.target.value))}
                                        min="1"
                                        max="365"
                                        className="bg-gray-800 border-gray-700"
                                      />
                                    </div>
                                    <Button 
                                      className="w-full mt-4" 
                                      onClick={grantTempAccess}
                                      disabled={isGranting}
                                    >
                                      {isGranting ? "Processando..." : "Conceder Acesso"}
                                    </Button>
                                  </div>
                                </SheetContent>
                              </Sheet>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Assinaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Usuário</th>
                        <th className="text-left p-2">Tipo de Plano</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Data de Término</th>
                        <th className="text-left p-2">ID do Cliente Stripe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center p-4 text-gray-400">
                            Nenhuma assinatura encontrada
                          </td>
                        </tr>
                      ) : (
                        subscriptions.map((subscription) => {
                          const user = users.find(u => u.id === subscription.user_id);
                          return (
                            <tr key={subscription.id} className="border-b border-gray-700">
                              <td className="p-2">{user?.email || 'Usuário não encontrado'}</td>
                              <td className="p-2">
                                {subscription.plan_type === 'monthly' ? 'Mensal' : 
                                 subscription.plan_type === 'annual' ? 'Anual' : subscription.plan_type}
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                  subscription.status === 'active' ? 'bg-green-600' : 'bg-gray-600'
                                }`}>
                                  {subscription.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                              </td>
                              <td className="p-2">
                                {subscription.current_period_end ? 
                                  new Date(subscription.current_period_end).toLocaleDateString('pt-BR') : 
                                  'N/A'}
                              </td>
                              <td className="p-2 truncate max-w-[150px]">
                                {subscription.stripe_customer_id || 'N/A'}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="temp_access">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Acessos Temporários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left p-2">Usuário</th>
                        <th className="text-left p-2">Concedido Por</th>
                        <th className="text-left p-2">Data de Expiração</th>
                        <th className="text-left p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tempAccesses.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center p-4 text-gray-400">
                            Nenhum acesso temporário encontrado
                          </td>
                        </tr>
                      ) : (
                        tempAccesses.map((access) => {
                          const user = users.find(u => u.id === access.user_id);
                          const grantor = users.find(u => u.id === access.granted_by);
                          const isActive = new Date(access.expires_at) > new Date();
                          
                          return (
                            <tr key={access.id} className="border-b border-gray-700">
                              <td className="p-2">{user?.email || 'Usuário não encontrado'}</td>
                              <td className="p-2">{grantor?.email || 'Admin'}</td>
                              <td className="p-2">
                                {new Date(access.expires_at).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-2">
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                  isActive ? 'bg-green-600' : 'bg-red-600'
                                }`}>
                                  {isActive ? 'Ativo' : 'Expirado'}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
