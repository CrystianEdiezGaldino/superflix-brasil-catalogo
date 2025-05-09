
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { MediaItem } from "@/types/movie";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTab from "@/components/profile/ProfileTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import FavoritesTab from "@/components/profile/FavoritesTab";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, isSubscribed, subscriptionTier, subscriptionEnd, hasTempAccess } = useSubscription();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Erro ao carregar perfil");
      }

      setIsLoading(false);
    };

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id);

        if (error) throw error;

        // Convert favorites to MediaItem format
        const favoriteItems: MediaItem[] = data.map((fav: any) => {
          if (fav.media_type === "movie") {
            return {
              id: fav.media_id,
              title: fav.title,
              poster_path: fav.poster_path,
              media_type: "movie",
              overview: "",
              backdrop_path: "",
              vote_average: 0,
              release_date: ""
            };
          } else {
            return {
              id: fav.media_id,
              name: fav.title,
              poster_path: fav.poster_path,
              media_type: "tv",
              overview: "",
              backdrop_path: "",
              vote_average: 0,
              first_air_date: ""
            };
          }
        });

        setFavorites(favoriteItems);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Erro ao carregar favoritos");
      }
    };

    fetchProfile();
    fetchFavorites();
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-netflix-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={() => {}} />
      
      <main className="container max-w-full pt-20 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <ProfileHeader isAdmin={isAdmin} />
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileTab 
                user={user}
                profile={profile}
                handleLogout={handleLogout}
              />
            </TabsContent>

            <TabsContent value="subscription">
              <SubscriptionTab 
                user={user}
                isSubscribed={isSubscribed}
                hasTempAccess={hasTempAccess}
                subscriptionTier={subscriptionTier}
                subscriptionEnd={subscriptionEnd}
              />
            </TabsContent>
            
            <TabsContent value="favorites">
              <FavoritesTab favorites={favorites} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
