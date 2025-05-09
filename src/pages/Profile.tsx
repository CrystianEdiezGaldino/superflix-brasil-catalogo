
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaItem } from "@/types/movie";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import MediaCard from "@/components/MediaCard";

interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface Favorite {
  id: string;
  media_id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        setUsername(data.username || "");
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
        const favoriteItems: MediaItem[] = data.map((fav: Favorite) => ({
          id: fav.media_id,
          title: fav.title,
          poster_path: fav.poster_path,
          media_type: fav.media_type,
          // Add required properties with default values
          overview: "",
          backdrop_path: "",
          vote_average: 0,
          release_date: "",
        }));

        setFavorites(favoriteItems);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Erro ao carregar favoritos");
      }
    };

    fetchProfile();
    fetchFavorites();
  }, [user, navigate]);

  const updateProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-white mb-6">Meu Perfil</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card className="bg-gray-900 text-white border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input 
                        value={user?.email || ""} 
                        disabled 
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Nome de usuário</label>
                      <Input 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={updateProfile} 
                        disabled={isSaving}
                      >
                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                      >
                        Sair
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="favorites">
              <Card className="bg-gray-900 text-white border-gray-700">
                <CardContent className="pt-6">
                  {favorites.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-400">Você ainda não adicionou nenhum favorito</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate("/")}
                      >
                        Explorar Conteúdos
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {favorites.map((media) => (
                        <div key={`${media.media_type}-${media.id}`}>
                          <MediaCard media={media} />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
