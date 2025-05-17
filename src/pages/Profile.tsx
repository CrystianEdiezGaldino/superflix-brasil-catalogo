import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, User, Heart, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTab from "@/components/profile/ProfileTab";
import FavoritesTab from "@/components/profile/FavoritesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, signOut } = useAuth();
  const { 
    isSubscribed, 
    subscription,
    hasTempAccess,
    isAdmin
  } = useSubscription();
  
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-netflix-background">
        <div className="text-center p-8 rounded-lg bg-black/50 backdrop-blur-sm">
          <h2 className="text-2xl text-white mb-6">Você precisa estar logado para acessar seu perfil</h2>
          <Button 
            onClick={() => window.location.href = "/auth"}
            className="bg-netflix-red hover:bg-netflix-red/90 text-white px-6 py-2 rounded-md transition-colors"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  const profile = {
    username: user.user_metadata?.name || user.email?.split('@')[0] || "Usuário",
    email: user.email,
    createdAt: user.created_at,
  };

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      {/* Header com gradiente e efeito de blur */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/20 via-netflix-red/10 to-transparent" />
        <div className="absolute inset-0 backdrop-blur-sm" />
        <div className="relative pt-24 px-4 md:px-8">
          {/* Header */}
          <div className="max-w-4xl mx-auto">
            <ProfileHeader isAdmin={isAdmin} />
            
            {/* Botão Admin */}
            {isAdmin && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="border-netflix-red text-netflix-red hover:bg-netflix-red hover:text-white transition-colors"
                  onClick={() => window.location.href = "/admin"}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Painel Administrativo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Conteúdo Principal */}
      <div className="relative px-4 md:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Tabs com design melhorado */}
          <Tabs 
            defaultValue="profile" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="mt-8"
          >
            <TabsList className="grid grid-cols-3 mb-8 bg-black/50 backdrop-blur-sm p-1 rounded-lg">
              <TabsTrigger 
                value="profile"
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white flex items-center gap-2"
              >
                <User size={18} />
                Perfil
              </TabsTrigger>
              <TabsTrigger 
                value="favorites"
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white flex items-center gap-2"
              >
                <Heart size={18} />
                Favoritos
              </TabsTrigger>
              <TabsTrigger 
                value="subscription"
                className="data-[state=active]:bg-netflix-red data-[state=active]:text-white flex items-center gap-2"
              >
                <CreditCard size={18} />
                Assinatura
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6">
              <TabsContent value="profile" className="mt-0">
                <ProfileTab 
                  user={user}
                  profile={profile}
                  handleLogout={handleLogout} 
                />
              </TabsContent>
              
              <TabsContent value="favorites" className="mt-0">
                <FavoritesTab />
              </TabsContent>
              
              <TabsContent value="subscription" className="mt-0">
                <SubscriptionTab 
                  user={user}
                  isSubscribed={isSubscribed}
                  hasTempAccess={hasTempAccess}
                  subscriptionTier={subscription?.plan_type || null}
                  subscriptionEnd={subscription?.current_period_end || null}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
