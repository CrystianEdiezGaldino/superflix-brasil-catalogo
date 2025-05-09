
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import { MediaItem, Movie, Series } from "@/types/movie";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
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
  const { isAdmin, isSubscribed, subscriptionTier, subscriptionEnd, hasTempAccess } = useSubscription();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
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
            } as Movie;
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
            } as Series;
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

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    setIsCanceling(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: {}
      });

      if (error) throw error;
      
      if (data.demo_mode) {
        toast.error("Sistema de pagamento em modo de demonstração");
        return;
      }
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Erro ao processar solicitação");
    } finally {
      setIsCanceling(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('pt-BR');
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
          
          {/* Admin Panel Link - Only visible for admin users */}
          {isAdmin && (
            <div className="mb-6">
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  className="border-netflix-red text-netflix-red hover:bg-netflix-red/20 flex items-center gap-2"
                >
                  <Shield size={20} />
                  Acessar Painel de Administração
                </Button>
              </Link>
            </div>
          )}
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
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

            <TabsContent value="subscription">
              <Card className="bg-gray-900 text-white border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {isSubscribed ? (
                      <>
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle size={20} />
                          <span className="font-semibold text-lg">Assinatura Ativa</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={18} className="text-gray-400" />
                              <span className="text-gray-400">Plano</span>
                            </div>
                            <p className="font-semibold">
                              {subscriptionTier === "monthly" ? "Mensal" : 
                               subscriptionTier === "annual" ? "Anual" : 
                               "Premium"}
                            </p>
                          </div>
                          
                          <div className="bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar size={18} className="text-gray-400" />
                              <span className="text-gray-400">Válido até</span>
                            </div>
                            <p className="font-semibold">{formatDate(subscriptionEnd)}</p>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm text-gray-400 mb-3">
                            Sua assinatura será renovada automaticamente na data de vencimento. 
                            Você pode cancelar a qualquer momento.
                          </p>
                          <Button 
                            variant="destructive"
                            onClick={handleCancelSubscription}
                            disabled={isCanceling}
                            className="w-full sm:w-auto"
                          >
                            {isCanceling ? "Processando..." : "Gerenciar/Cancelar Assinatura"}
                          </Button>
                        </div>
                      </>
                    ) : hasTempAccess ? (
                      <>
                        <div className="flex items-center gap-2 text-yellow-400">
                          <CheckCircle size={20} />
                          <span className="font-semibold text-lg">Acesso Temporário</span>
                        </div>
                        
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar size={18} className="text-gray-400" />
                            <span className="text-gray-400">Válido até</span>
                          </div>
                          <p className="font-semibold">{formatDate(subscriptionEnd)}</p>
                        </div>
                        
                        <div className="pt-2">
                          <p className="text-sm text-gray-400 mb-3">
                            Você tem acesso temporário ao nosso conteúdo. 
                            Para continuar tendo acesso após o período de avaliação, assine um de nossos planos.
                          </p>
                          <Button 
                            onClick={() => navigate("/subscribe")}
                            className="w-full sm:w-auto"
                          >
                            Ver Planos de Assinatura
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle size={20} />
                          <span className="font-semibold text-lg">Sem Assinatura Ativa</span>
                        </div>
                        
                        <p className="text-gray-300 py-2">
                          Você ainda não possui uma assinatura ativa. 
                          Assine agora para ter acesso completo a todo o conteúdo.
                        </p>
                        
                        <Button 
                          onClick={() => navigate("/subscribe")}
                          className="w-full sm:w-auto"
                        >
                          Ver Planos de Assinatura
                        </Button>
                      </>
                    )}
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
