
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTab from "@/components/profile/ProfileTab";
import FavoritesTab from "@/components/profile/FavoritesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout } = useAuth();
  const { 
    isSubscribed, 
    subscriptionTier,
    subscriptionEnd,
    hasTempAccess,
    hasTrialAccess
  } = useSubscription();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-netflix-background">
        <div className="text-center">
          <h2 className="text-xl text-white mb-4">Você precisa estar logado para acessar seu perfil</h2>
          <button 
            onClick={() => window.location.href = "/auth"}
            className="bg-netflix-red text-white px-4 py-2 rounded"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  const profile = {
    displayName: user.user_metadata?.name || user.email?.split('@')[0] || "Usuário",
    email: user.email,
    createdAt: user.created_at,
  };

  return (
    <div className="min-h-screen bg-netflix-background p-4 md:p-8">
      {/* Header */}
      <ProfileHeader displayName={profile.displayName} />
      
      {/* Tabs */}
      <Tabs 
        defaultValue="profile" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="max-w-4xl mx-auto mt-12"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          <TabsTrigger value="subscription">Assinatura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-4">
          <ProfileTab 
            profile={profile} 
            handleLogout={handleLogout} 
          />
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-4">
          <FavoritesTab />
        </TabsContent>
        
        <TabsContent value="subscription" className="mt-4">
          <SubscriptionTab 
            user={user}
            isSubscribed={isSubscribed}
            hasTempAccess={hasTempAccess}
            hasTrialAccess={hasTrialAccess}
            subscriptionTier={subscriptionTier}
            subscriptionEnd={subscriptionEnd}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
