import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  CreditCard, 
  Clock, 
  Gift, 
  Edit, 
  Trash2,
  Search,
  Filter,
  TrendingUp,
  DollarSign
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { AdminStats, UserWithSubscription, TempAccess, PromoCode } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

import { AdminOverview } from "@/components/admin/AdminOverview";
import { UsersTable } from "@/components/admin/UsersTable";
import { PromoCodesTable } from "@/components/admin/PromoCodesTable";
import { TempAccessTable } from "@/components/admin/TempAccessTable";
import { Spinner } from "@/components/ui/spinner";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isSubscriptionLoading, checkSubscription } = useSubscription();
  const { user, loading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [adminData, setAdminData] = useState<{
    users: UserWithSubscription[];
    promoCodes: PromoCode[];
    tempAccesses: TempAccess[];
    stats: AdminStats;
  } | null>(null);

  // Estados para formulários
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discount: 0,
    type: "percentage" as "percentage" | "fixed",
    expires_at: "",
    usage_limit: 1
  });

  const [userEdit, setUserEdit] = useState({
    plan_type: "",
    current_period_end: "",
    status: "active" as "active" | "inactive"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carregar usuários
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select(`
          id,
          email,
          name,
          created_at,
          is_admin,
          subscription:subscriptions(*)
        `);

      if (usersError) throw usersError;

      // Carregar códigos promocionais
      const { data: promoCodesData, error: promoCodesError } = await supabase
        .from("promo_codes")
        .select("*");

      if (promoCodesError) throw promoCodesError;

      // Carregar acessos temporários
      const { data: tempAccessData, error: tempAccessError } = await supabase
        .from("temp_access")
        .select("*");

      if (tempAccessError) throw tempAccessError;

      // Calcular estatísticas
      const typedUsers = usersData as unknown as UserWithSubscription[];
      const typedPromoCodes = promoCodesData as unknown as PromoCode[];
      const typedTempAccess = tempAccessData as unknown as TempAccess[];

      const activeSubscriptions = typedUsers.filter(
        (user) => user.subscription?.status === "active"
      ).length;

      const adminUsers = typedUsers.filter((user) => user.is_admin).length;

      const monthlyRevenue = typedUsers
        .filter(
          (user) =>
            user.subscription?.status === "active" &&
            user.subscription?.plan_type === "monthly"
        )
        .reduce((acc) => acc + 19.90, 0);

      const yearlyRevenue = typedUsers
        .filter(
          (user) =>
            user.subscription?.status === "active" &&
            user.subscription?.plan_type === "yearly"
        )
        .reduce((acc) => acc + 199.90, 0);

      setAdminData({
        users: typedUsers,
        promoCodes: typedPromoCodes,
        tempAccesses: typedTempAccess,
        stats: {
          totalUsers: typedUsers.length,
          activeSubscriptions,
          tempAccess: typedTempAccess.length,
          promoCodes: typedPromoCodes.length,
          adminUsers,
          monthlyRevenue,
          yearlyRevenue
        }
      });
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar dados administrativos");
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar permissões de admin
  useEffect(() => {
    if (user && !isAuthLoading) {
      checkSubscription();
    }
  }, [user, isAuthLoading]);

  useEffect(() => {
    if (!isAuthLoading && !isSubscriptionLoading) {
      if (isAdmin) {
        loadData();
      } else if (!isAdmin && !isLoading) {
        navigate("/");
        toast.error("Acesso restrito a administradores");
      }
    }
  }, [isAdmin, isAuthLoading, isSubscriptionLoading, navigate, user]);

  // Funções CRUD
  const handleCreatePromoCode = async () => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .insert({
          code: newPromoCode.code,
          discount: newPromoCode.discount,
          type: newPromoCode.type,
          expires_at: newPromoCode.expires_at,
          usage_limit: newPromoCode.usage_limit,
          usage_count: 0,
          is_active: true
        });

      if (error) throw error;

      toast.success("Código promocional criado com sucesso!");
      setShowPromoDialog(false);
      loadData();
    } catch (error) {
      toast.error("Erro ao criar código promocional");
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          plan_type: userEdit.plan_type,
          current_period_end: userEdit.current_period_end,
          status: userEdit.status
        })
        .eq('user_id', selectedUser.id);

      if (error) throw error;

      toast.success("Usuário atualizado com sucesso!");
      setShowUserDialog(false);
      loadData();
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };

  const handleGrantTempAccess = async (userId: string) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 dias de acesso

      const { error } = await supabase
        .from('temp_access')
        .insert({
          user_id: userId,
          granted_by: user?.id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          expires_at: endDate.toISOString(),
          is_active: true
        });

      if (error) throw error;

      toast.success("Acesso temporário concedido com sucesso!");
      loadData();
    } catch (error) {
      toast.error("Erro ao conceder acesso temporário");
    }
  };

  if (isAuthLoading || isSubscriptionLoading || (isLoading && !adminData)) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 px-4 pb-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white"
              onClick={() => setShowPromoDialog(true)}
            >
              <Gift className="h-4 w-4 mr-2" />
              Novo Código Promocional
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-netflix-dark">
            <TabsTrigger value="overview" className="data-[state=active]:bg-netflix-red">
              <TrendingUp className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-netflix-red">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="promos" className="data-[state=active]:bg-netflix-red">
              <Gift className="h-4 w-4 mr-2" />
              Códigos Promocionais
            </TabsTrigger>
            <TabsTrigger value="temp-access" className="data-[state=active]:bg-netflix-red">
              <Clock className="h-4 w-4 mr-2" />
              Acessos Temporários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview stats={adminData?.stats} />
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-netflix-dark border-netflix-red text-white"
                    />
                  </div>
                  <Button variant="outline" className="border-netflix-red text-netflix-red">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtrar
                  </Button>
                </div>
              </div>

              <div className="border border-netflix-red rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-netflix-dark">
                      <TableHead className="text-white">Nome</TableHead>
                      <TableHead className="text-white">Email</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Assinatura</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData?.users
                      .filter(user => 
                        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        user.name?.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((user) => (
                        <TableRow key={user.id} className="bg-netflix-dark">
                          <TableCell className="text-white">{user.name}</TableCell>
                          <TableCell className="text-white">{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.is_admin ? "destructive" : "default"}>
                              {user.is_admin ? "Admin" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.subscription?.status === "active" ? "default" : "destructive"}>
                              {user.subscription?.status === "active" ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUserEdit({
                                    plan_type: user.subscription?.plan_type || "",
                                    current_period_end: user.subscription?.current_period_end || "",
                                    status: user.subscription?.status as "active" | "inactive" || "active"
                                  });
                                  setShowUserDialog(true);
                                }}
                              >
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGrantTempAccess(user.id)}
                              >
                                Acesso 30 dias
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="promos">
            <div className="space-y-4">
              <div className="border border-netflix-red rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-netflix-dark">
                      <TableHead className="text-white">Código</TableHead>
                      <TableHead className="text-white">Desconto</TableHead>
                      <TableHead className="text-white">Tipo</TableHead>
                      <TableHead className="text-white">Expiração</TableHead>
                      <TableHead className="text-white">Uso</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData?.promoCodes.map((promo) => (
                      <TableRow key={promo.id} className="bg-netflix-dark">
                        <TableCell className="text-white">{promo.code}</TableCell>
                        <TableCell className="text-white">{promo.discount}%</TableCell>
                        <TableCell className="text-white">{promo.type}</TableCell>
                        <TableCell className="text-white">
                          {new Date(promo.expires_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white">
                          {promo.usage_count}/{promo.usage_limit}
                        </TableCell>
                        <TableCell>
                          <Badge variant={promo.is_active ? "default" : "destructive"}>
                            {promo.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="temp-access">
            <div className="space-y-4">
              <div className="border border-netflix-red rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-netflix-dark">
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Concedido Por</TableHead>
                      <TableHead className="text-white">Início</TableHead>
                      <TableHead className="text-white">Expiração</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData?.tempAccesses.map((access) => (
                      <TableRow key={access.id} className="bg-netflix-dark">
                        <TableCell className="text-white">
                          {adminData.users.find(u => u.id === access.user_id)?.email}
                        </TableCell>
                        <TableCell className="text-white">
                          {adminData.users.find(u => u.id === access.granted_by)?.email}
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(access.start_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-white">
                          {new Date(access.expires_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={access.is_active ? "default" : "destructive"}>
                            {access.is_active ? "Ativo" : "Expirado"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para editar usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-netflix-dark text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white">Tipo de Plano</label>
              <Select
                value={userEdit.plan_type}
                onValueChange={(value) => setUserEdit({ ...userEdit, plan_type: value })}
              >
                <SelectTrigger className="bg-netflix-dark border-netflix-red text-white">
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-white">Data de Expiração</label>
              <Input
                type="date"
                value={userEdit.current_period_end.split('T')[0]}
                onChange={(e) => setUserEdit({ ...userEdit, current_period_end: e.target.value })}
                className="bg-netflix-dark border-netflix-red text-white"
              />
            </div>
            <div>
              <label className="text-white">Status</label>
              <Select
                value={userEdit.status}
                onValueChange={(value) => setUserEdit({ ...userEdit, status: value as "active" | "inactive" })}
              >
                <SelectTrigger className="bg-netflix-dark border-netflix-red text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleUpdateUser}
              className="w-full bg-netflix-red hover:bg-netflix-red/90"
            >
              Atualizar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar código promocional */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="bg-netflix-dark text-white">
          <DialogHeader>
            <DialogTitle>Criar Código Promocional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-white">Código</label>
              <Input
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value })}
                className="bg-netflix-dark border-netflix-red text-white"
              />
            </div>
            <div>
              <label className="text-white">Desconto (%)</label>
              <Input
                type="number"
                value={newPromoCode.discount}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, discount: Number(e.target.value) })}
                className="bg-netflix-dark border-netflix-red text-white"
              />
            </div>
            <div>
              <label className="text-white">Data de Expiração</label>
              <Input
                type="date"
                value={newPromoCode.expires_at.split('T')[0]}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, expires_at: e.target.value })}
                className="bg-netflix-dark border-netflix-red text-white"
              />
            </div>
            <div>
              <label className="text-white">Limite de Uso</label>
              <Input
                type="number"
                value={newPromoCode.usage_limit}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, usage_limit: Number(e.target.value) })}
                className="bg-netflix-dark border-netflix-red text-white"
              />
            </div>
            <Button
              onClick={handleCreatePromoCode}
              className="w-full bg-netflix-red hover:bg-netflix-red/90"
            >
              Criar Código
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
