
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import StatsOverview from "@/components/admin/StatsOverview";
import UsersTab from "@/components/admin/UsersTab";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import TempAccessTab from "@/components/admin/TempAccessTab";
import PromoCodesTab from "@/components/admin/PromoCodesTab";
import { fetchAdminData } from "@/components/admin/AdminDataService";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useAuth } from "@/contexts/AuthContext";
import { AdminStats, UserWithSubscription } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: isSubscriptionLoading, checkSubscription } = useSubscription();
  const { user, loading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState<{
    users: UserWithSubscription[];
    subscriptions: any[];
    tempAccesses: any[];
    stats: AdminStats;
  } | null>(null);
  
  const loadData = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching admin data...");
      const data = await fetchAdminData();
      console.log("Admin data fetched:", data);
      setAdminData(data);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Erro ao carregar dados administrativos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Force check subscription status when loading admin page
  useEffect(() => {
    if (user && !isAuthLoading) {
      checkSubscription();
    }
  }, [user, isAuthLoading]);
  
  useEffect(() => {
    // Só carrega os dados quando soubermos que é um admin
    if (!isAuthLoading && !isSubscriptionLoading) {
      if (isAdmin) {
        loadData();
      } else if (!isAdmin && !isLoading) {
        // Log the problem for debugging
        console.log("Access denied to admin page:", { isAdmin, user });
        
        // For testing purposes - log admin status to console
        const checkAdminRole = async () => {
          if (!user) return;
          
          try {
            const { data, error } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', user.id)
              .eq('role', 'admin');
              
            console.log("Admin role check:", { data, error, userId: user.id });
          } catch (err) {
            console.error("Error checking admin role:", err);
          }
        };
        
        checkAdminRole();
        
        // Redireciona se não for admin
        navigate("/");
        toast.error("Acesso restrito a administradores");
      }
    }
  }, [isAdmin, isAuthLoading, isSubscriptionLoading, navigate, user]);
  
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
        <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="temp-access">Acessos Temporários</TabsTrigger>
            <TabsTrigger value="promo-codes">Códigos Promocionais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {adminData && <StatsOverview stats={adminData.stats} onRefresh={loadData} />}
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            {adminData && <UsersTab users={adminData.users} onUserUpdate={loadData} />}
          </TabsContent>
          
          <TabsContent value="subscriptions" className="space-y-6">
            {adminData && <SubscriptionsTab subscriptions={adminData.subscriptions} users={adminData.users} />}
          </TabsContent>
          
          <TabsContent value="temp-access" className="space-y-6">
            {adminData && <TempAccessTab tempAccesses={adminData.tempAccesses} users={adminData.users} />}
          </TabsContent>
          
          <TabsContent value="promo-codes" className="space-y-6">
            <PromoCodesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
