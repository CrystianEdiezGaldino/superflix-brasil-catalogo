
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats, UserWithSubscription } from "@/types/admin";
import StatsOverview from "@/components/admin/StatsOverview";
import UsersTab from "@/components/admin/UsersTab";
import SubscriptionsTab from "@/components/admin/SubscriptionsTab";
import TempAccessTab from "@/components/admin/TempAccessTab";
import { fetchAdminData } from "@/components/admin/AdminDataService";

const Admin = () => {
  const { isAdmin, isLoading: isSubscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tempAccesses, setTempAccesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
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

    loadAdminData();
  }, [isAdmin, isSubscriptionLoading, navigate]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminData();
      console.log("Admin data loaded:", data);
      setUsers(data.users || []);
      setSubscriptions(data.subscriptions || []);
      setTempAccesses(data.tempAccesses || []);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Erro ao carregar dados administrativos');
    } finally {
      setIsLoading(false);
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
        
        <StatsOverview stats={stats} />
        
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-4 bg-gray-800">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
            <TabsTrigger value="temp_access">Acessos Temporários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="users">
            <UsersTab users={users} onUserUpdate={loadAdminData} />
          </TabsContent>
          
          <TabsContent value="subscriptions">
            <SubscriptionsTab subscriptions={subscriptions} users={users} />
          </TabsContent>
          
          <TabsContent value="temp_access">
            <TempAccessTab tempAccesses={tempAccesses} users={users} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
