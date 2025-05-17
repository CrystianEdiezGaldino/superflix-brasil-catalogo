import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Spinner } from "@/components/ui/spinner";
import AdminInfoCard from "@/components/admin/AdminInfoCard";
import AdminsTable from "@/components/admin/AdminsTable";
import { UsersTable } from "@/components/admin/UsersTable";
import { TicketList } from "@/components/admin/TicketList";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

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

const Admin = () => {
  const navigate = useNavigate();
  const { user, loading: isAuthLoading } = useAuth();
  const { isAdmin, isLoading: isSubscriptionLoading, checkSubscription } = useSubscription();
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Verificar permissões de admin
  useEffect(() => {
    if (user && !isAuthLoading) {
      checkSubscription();
    }
  }, [user, isAuthLoading]);

  // Carregar dados quando confirmado que é admin
  useEffect(() => {
    if (!isAuthLoading && !isSubscriptionLoading) {
      if (isAdmin) {
        loadAdmins();
        loadUsers();
      } else {
        navigate("/");
        toast.error("Acesso restrito a administradores");
      }
    }
  }, [isAdmin, isAuthLoading, isSubscriptionLoading]);

  const loadAdmins = async () => {
    try {
      // Buscar todos os usuários com role 'admin'
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');

      if (rolesError) throw rolesError;

      if (adminRoles && adminRoles.length > 0) {
        // Buscar os dados dos usuários admin
        const { data: adminUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id, username, created_at')
          .in('id', adminRoles.map(role => role.user_id));

        if (usersError) throw usersError;

        // Transformar os dados para o formato que queremos
        const formattedAdmins = adminUsers.map(admin => ({
          id: admin.id,
          email: admin.username, // Usando o username como email
          name: admin.id, // Usando o ID como nome
          created_at: admin.created_at
        }));

        setAdmins(formattedAdmins);
      }
    } catch (error) {
      console.error("Erro ao carregar admins:", error);
      toast.error("Erro ao carregar lista de administradores");
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      
      // Buscar todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar todas as assinaturas
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;

      // Mapear as assinaturas para os usuários
      const formattedUsers = profiles.map(profile => {
        const subscription = subscriptions?.find(sub => sub.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.username, // Usando o username como email
          created_at: profile.created_at,
          avatar_url: profile.avatar_url,
          subscription: subscription || undefined
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  if (isAuthLoading || isSubscriptionLoading || isLoading) {
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
        <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>

        <div className="space-y-8">
          <AdminInfoCard user={user} />
          <AdminsTable admins={admins} />
          <UsersTable 
            users={users} 
            isLoading={isLoadingUsers} 
            onRefresh={loadUsers}
          />
          <TicketList />
        </div>
      </div>
    </div>
  );
};

export default Admin;
