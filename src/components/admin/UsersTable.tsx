import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Edit, 
  Trash2, 
  Calendar, 
  CreditCard,
  Search,
  Filter,
  Users,
  Mail,
  Clock,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  plan_type: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  email: string;
  created_at: string;
  avatar_url: string | null;
  subscription?: Subscription;
}

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const UsersTable = ({ users, isLoading, onRefresh }: UsersTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);
  const [editedEmail, setEditedEmail] = useState("");
  const [subscriptionData, setSubscriptionData] = useState({
    status: 'active',
    plan_type: 'trial',
    current_period_start: '',
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedEmail(user.email);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: editedEmail })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast.success('Email atualizado com sucesso!');
      onRefresh();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar email');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast.success('Usuário excluído com sucesso!');
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleUpdateSubscription = async () => {
    if (!selectedUser) return;

    try {
      const { data: existingSubscription, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', selectedUser.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const subscriptionDataToUpdate = {
        user_id: selectedUser.id,
        status: subscriptionData.status,
        plan_type: subscriptionData.plan_type,
        current_period_start: subscriptionData.current_period_start || null,
        updated_at: new Date().toISOString()
      };

      let error;
      if (existingSubscription) {
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update(subscriptionDataToUpdate)
          .eq('id', existingSubscription.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert(subscriptionDataToUpdate);
        error = insertError;
      }

      if (error) {
        console.error('Detalhes do erro:', error);
        throw error;
      }

      toast.success('Assinatura atualizada com sucesso!');
      onRefresh();
      setIsSubscriptionDialogOpen(false);
    } catch (error: any) {
      console.error('Erro ao atualizar assinatura:', error);
      toast.error(`Erro ao atualizar assinatura: ${error.message || 'Erro desconhecido'}`);
    }
  };

  const getSubscriptionStatus = (subscription?: Subscription) => {
    if (!subscription) return { label: 'Sem assinatura', variant: 'destructive' as const };
    
    const now = new Date();
    const endDate = subscription.current_period_end ? new Date(subscription.current_period_end) : null;
    
    if (subscription.status === 'canceled') {
      return { label: 'Cancelada', variant: 'destructive' as const };
    }
    
    if (endDate && endDate < now) {
      return { label: 'Expirada', variant: 'destructive' as const };
    }
    
    return { label: 'Ativa', variant: 'default' as const };
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const activeSubscriptions = users.filter(user => 
      user.subscription?.status === 'active' || user.subscription?.status === 'trialing'
    ).length;
    const canceledSubscriptions = users.filter(user => 
      user.subscription?.status === 'canceled'
    ).length;
    const trialSubscriptions = users.filter(user => 
      user.subscription?.status === 'trialing'
    ).length;
    const expiredSubscriptions = users.filter(user => {
      if (!user.subscription?.current_period_end) return false;
      return new Date(user.subscription.current_period_end) < new Date();
    }).length;

    const monthlyRevenue = activeSubscriptions * 9.90;
    const projectedAnnualRevenue = monthlyRevenue * 12;

    return {
      totalUsers,
      activeSubscriptions,
      canceledSubscriptions,
      trialSubscriptions,
      expiredSubscriptions,
      monthlyRevenue,
      projectedAnnualRevenue
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
          <p className="text-gray-400">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-netflix-red/10 rounded-lg">
              <Users className="h-5 w-5 text-netflix-red" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total de Usuários</p>
              <h3 className="text-2xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Assinaturas Ativas</p>
              <h3 className="text-2xl font-bold text-white">{stats.activeSubscriptions}</h3>
            </div>
          </div>
        </div>

        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <ClockIcon className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Em Período de Teste</p>
              <h3 className="text-2xl font-bold text-white">{stats.trialSubscriptions}</h3>
            </div>
          </div>
        </div>

        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Assinaturas Canceladas</p>
              <h3 className="text-2xl font-bold text-white">{stats.canceledSubscriptions}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Receita Mensal Estimada</p>
              <h3 className="text-2xl font-bold text-white">
                R$ {stats.monthlyRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-netflix-dark/50 border border-netflix-red/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Receita Anual Projetada</p>
              <h3 className="text-2xl font-bold text-white">
                R$ {stats.projectedAnnualRevenue.toFixed(2)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-netflix-red/10 rounded-lg">
            <Users className="h-5 w-5 text-netflix-red" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Usuários Cadastrados</h2>
            <p className="text-sm text-gray-400">Gerencie os usuários do sistema</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 rounded-md p-2 focus:ring-2 focus:ring-netflix-red focus:border-netflix-red"
            />
          </div>
          <Button variant="outline" className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="border border-netflix-red rounded-lg overflow-hidden bg-netflix-dark/50 h-full flex flex-col">
          <div className="overflow-y-auto flex-1">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-netflix-dark border-b border-netflix-red/20">
                  <TableHead className="text-white font-semibold">Avatar</TableHead>
                  <TableHead className="text-white font-semibold">Email</TableHead>
                  <TableHead className="text-white font-semibold">Data de Cadastro</TableHead>
                  <TableHead className="text-white font-semibold">Assinatura</TableHead>
                  <TableHead className="text-white font-semibold">Tipo de Plano</TableHead>
                  <TableHead className="text-white font-semibold">Próxima Renovação</TableHead>
                  <TableHead className="text-white font-semibold">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const status = getSubscriptionStatus(user.subscription);
                  return (
                    <TableRow key={user.id} className="bg-netflix-dark hover:bg-gray-800/50 transition-colors">
                      <TableCell className="text-white">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt={user.email} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-netflix-red/20"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-netflix-red/20 flex items-center justify-center text-white border-2 border-netflix-red/20">
                            {user.email[0].toUpperCase()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="bg-opacity-20">
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">
                        {user.subscription?.plan_type ? (
                          <Badge variant="outline" className="border-netflix-red text-netflix-red bg-netflix-red/10">
                            {user.subscription.plan_type}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">Sem plano</span>
                        )}
                      </TableCell>
                      <TableCell className="text-white">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {user.subscription?.current_period_end 
                            ? format(new Date(user.subscription.current_period_end), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            : 'N/A'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setSubscriptionData({
                                status: user.subscription?.status || 'active',
                                plan_type: user.subscription?.plan_type || 'trial',
                                current_period_start: user.subscription?.current_period_start || '',
                              });
                              setIsSubscriptionDialogOpen(true);
                            }}
                            className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Dialog para editar usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-netflix-dark border-netflix-red">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold">Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-netflix-red focus:border-netflix-red"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateUser}
                className="bg-netflix-red text-white hover:bg-netflix-red/90 transition-colors"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para gerenciar assinatura */}
      <Dialog open={isSubscriptionDialogOpen} onOpenChange={setIsSubscriptionDialogOpen}>
        <DialogContent className="bg-netflix-dark border-netflix-red max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-bold mb-2">Gerenciar Assinatura</DialogTitle>
            <p className="text-gray-400 text-sm">
              Gerencie os detalhes da assinatura do usuário {selectedUser?.email}
            </p>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Status da Assinatura</label>
              <select
                value={subscriptionData.status}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-netflix-red focus:border-netflix-red"
              >
                <option value="trialing">Período de Teste</option>
                <option value="active">Ativa</option>
                <option value="canceled">Cancelada</option>
                <option value="incomplete">Incompleta</option>
                <option value="incomplete_expired">Incompleta Expirada</option>
                <option value="past_due">Atrasada</option>
                <option value="unpaid">Não Paga</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Data de Início</label>
              <input
                type="date"
                value={subscriptionData.current_period_start || ''}
                onChange={(e) => setSubscriptionData(prev => ({ ...prev, current_period_start: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-2 focus:ring-netflix-red focus:border-netflix-red"
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-700 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSubscriptionDialogOpen(false)}
              className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors px-6"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateSubscription}
              className="bg-netflix-red text-white hover:bg-netflix-red/90 transition-colors px-6"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 