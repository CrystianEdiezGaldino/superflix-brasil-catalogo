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
import { AdminStats, UserWithSubscription, Subscription, TempAccess, PromoCode } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { fetchAdminData } from "@/services/adminService";

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
    subscriptions: Subscription[];
    tempAccesses: TempAccess[];
    stats: AdminStats;
  } | null>(null);

  // Estados para formulários
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    expires_at: "",
    usage_limit: ""
  });

  const [userEdit, setUserEdit] = useState({
    plan_type: "",
    current_period_end: "",
    status: "active" as "active" | "inactive"
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAdminData();
      setAdminData(data);
    } catch (error) {
      console.error("Error loading admin data:", error);
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
        .insert([{
          code: newPromoCode.code,
          discount: parseFloat(newPromoCode.discount),
          type: newPromoCode.type,
          expires_at: newPromoCode.expires_at,
          usage_limit: parseInt(newPromoCode.usage_limit),
          usage_count: 0,
          is_active: true,
          created_by: user?.id
        }]);

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

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Tem certeza que deseja remover este usuário?")) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success("Usuário removido com sucesso!");
      loadData();
    } catch (error) {
      toast.error("Erro ao remover usuário");
    }
  };

  if (isAuthLoading || isSubscriptionLoading || (isLoading && !adminData)) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
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
          <TabsList className="bg-black/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Visão Geral
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Usuários
            </TabsTrigger>
            <TabsTrigger 
              value="subscriptions"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Assinaturas
            </TabsTrigger>
            <TabsTrigger 
              value="temp-access"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Acessos Temporários
            </TabsTrigger>
            <TabsTrigger 
              value="promo-codes"
              className="data-[state=active]:bg-netflix-red data-[state=active]:text-white"
            >
              Códigos Promocionais
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {adminData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black/50 backdrop-blur-sm border-netflix-red/20 hover:border-netflix-red/40 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Total de Usuários</CardTitle>
                    <Users className="h-4 w-4 text-netflix-red" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{adminData.stats.totalUsers}</div>
                    <p className="text-xs text-gray-400">Usuários ativos</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-netflix-red/20 hover:border-netflix-red/40 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Assinaturas Ativas</CardTitle>
                    <CreditCard className="h-4 w-4 text-netflix-red" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{adminData.stats.activeSubscriptions}</div>
                    <p className="text-xs text-gray-400">Assinantes ativos</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-netflix-red/20 hover:border-netflix-red/40 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Acessos Temporários</CardTitle>
                    <Clock className="h-4 w-4 text-netflix-red" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{adminData.stats.tempAccesses}</div>
                    <p className="text-xs text-gray-400">Acessos ativos</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-netflix-red/20 hover:border-netflix-red/40 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-white">Códigos Promocionais</CardTitle>
                    <Gift className="h-4 w-4 text-netflix-red" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{adminData.stats.promoCodes}</div>
                    <p className="text-xs text-gray-400">Códigos ativos</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/50 border-netflix-red/20 text-white"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px] bg-black/50 border-netflix-red/20 text-white">
                      <SelectValue placeholder="Filtrar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Ativos</SelectItem>
                      <SelectItem value="inactive">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Usuário</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Assinatura</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminData?.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="text-white">{user.name}</TableCell>
                      <TableCell className="text-white">{user.email}</TableCell>
                      <TableCell className="text-white">
                        <Badge variant={user.subscription?.status === 'active' ? "default" : "secondary"}>
                          {user.subscription?.plan_type || "Sem assinatura"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        <Badge variant={user.subscription?.status === 'active' ? "default" : "destructive"}>
                          {user.subscription?.status === 'active' ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setUserEdit({
                                plan_type: user.subscription?.plan_type || "",
                                current_period_end: user.subscription?.current_period_end || "",
                                status: user.subscription?.status || "inactive"
                              });
                              setShowUserDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-netflix-red" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="subscriptions" className="space-y-6">
            {adminData && (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Plano</TableHead>
                      <TableHead className="text-white">Início</TableHead>
                      <TableHead className="text-white">Fim</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.subscriptions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="text-white">{sub.user?.name}</TableCell>
                        <TableCell className="text-white">{sub.plan_type}</TableCell>
                        <TableCell className="text-white">{new Date(sub.start_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-white">{new Date(sub.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={sub.status === 'active' ? "default" : "destructive"}>
                            {sub.status === 'active' ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(sub.user as UserWithSubscription);
                              setUserEdit({
                                plan_type: sub.plan_type,
                                current_period_end: sub.end_date,
                                status: sub.status
                              });
                              setShowUserDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4 text-netflix-red" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="temp-access" className="space-y-6">
            {adminData && (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-white">Usuário</TableHead>
                      <TableHead className="text-white">Início</TableHead>
                      <TableHead className="text-white">Fim</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      <TableHead className="text-white">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.tempAccesses.map((access) => (
                      <TableRow key={access.id}>
                        <TableCell className="text-white">{access.user?.name}</TableCell>
                        <TableCell className="text-white">{new Date(access.start_date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-white">{new Date(access.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={access.is_active ? "default" : "destructive"}>
                            {access.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(access.user_id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="promo-codes" className="space-y-6">
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Código</TableHead>
                    <TableHead className="text-white">Desconto</TableHead>
                    <TableHead className="text-white">Tipo</TableHead>
                    <TableHead className="text-white">Válido até</TableHead>
                    <TableHead className="text-white">Usos</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminData?.stats.promoCodes > 0 && (
                    <TableRow>
                      <TableCell className="text-white">Exemplo</TableCell>
                      <TableCell className="text-white">10%</TableCell>
                      <TableCell className="text-white">Porcentagem</TableCell>
                      <TableCell className="text-white">31/12/2024</TableCell>
                      <TableCell className="text-white">0/100</TableCell>
                      <TableCell>
                        <Badge variant="default">Ativo</Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser("id")}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para editar usuário */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-black/95 backdrop-blur-sm border-netflix-red/20 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Plano de Assinatura</label>
              <Select
                value={userEdit.plan_type}
                onValueChange={(value) => setUserEdit({ ...userEdit, plan_type: value })}
              >
                <SelectTrigger className="w-full bg-black/50 border-netflix-red/20 text-white">
                  <SelectValue placeholder="Selecione o plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Data de Término</label>
              <Input
                type="date"
                value={userEdit.current_period_end}
                onChange={(e) => setUserEdit({ ...userEdit, current_period_end: e.target.value })}
                className="bg-black/50 border-netflix-red/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Status</label>
              <Select
                value={userEdit.status}
                onValueChange={(value) => setUserEdit({ ...userEdit, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger className="w-full bg-black/50 border-netflix-red/20 text-white">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowUserDialog(false)}
                className="border-netflix-red/20 text-white hover:bg-netflix-red/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateUser}
                className="bg-netflix-red hover:bg-netflix-red/90 text-white"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para criar código promocional */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="bg-black/95 backdrop-blur-sm border-netflix-red/20 text-white">
          <DialogHeader>
            <DialogTitle>Criar Código Promocional</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Código</label>
              <Input
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value })}
                className="bg-black/50 border-netflix-red/20 text-white"
                placeholder="Ex: SUPERFLIX10"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Desconto</label>
              <Input
                type="number"
                value={newPromoCode.discount}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, discount: e.target.value })}
                className="bg-black/50 border-netflix-red/20 text-white"
                placeholder="Ex: 10"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Tipo</label>
              <Select
                value={newPromoCode.type}
                onValueChange={(value) => setNewPromoCode({ ...newPromoCode, type: value as 'percentage' | 'fixed' })}
              >
                <SelectTrigger className="w-full bg-black/50 border-netflix-red/20 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-400">Válido até</label>
              <Input
                type="date"
                value={newPromoCode.expires_at}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, expires_at: e.target.value })}
                className="bg-black/50 border-netflix-red/20 text-white"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400">Máximo de usos</label>
              <Input
                type="number"
                value={newPromoCode.usage_limit}
                onChange={(e) => setNewPromoCode({ ...newPromoCode, usage_limit: e.target.value })}
                className="bg-black/50 border-netflix-red/20 text-white"
                placeholder="Ex: 100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowPromoDialog(false)}
                className="border-netflix-red/20 text-white hover:bg-netflix-red/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreatePromoCode}
                className="bg-netflix-red hover:bg-netflix-red/90 text-white"
              >
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
