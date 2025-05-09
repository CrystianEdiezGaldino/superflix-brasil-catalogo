
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMediaSearch } from "@/hooks/useMediaSearch";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTab from "@/components/profile/ProfileTab";
import FavoritesTab from "@/components/profile/FavoritesTab";
import SubscriptionTab from "@/components/profile/SubscriptionTab";
import { MediaItem } from "@/types/movie";

const Profile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { handleSearch: originalHandleSearch } = useMediaSearch();
  const [activeTab, setActiveTab] = useState("profile");

  // Handle search in this page
  const handleSearch = (query: string) => {
    if (query.trim()) {
      originalHandleSearch(query);
      navigate('/');
    }
  };

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  // Mock favorites for the favorites tab
  const mockFavorites: MediaItem[] = [
    {
      id: 1,
      title: "Example Movie 1",
      poster_path: "/placeholder.jpg",
      media_type: "movie",
      overview: "An example movie",
      backdrop_path: "/placeholder.jpg",
      vote_average: 8.5,
      release_date: "2023-01-01"
    },
    {
      id: 2,
      name: "Example Series 1",
      poster_path: "/placeholder.jpg",
      media_type: "tv",
      overview: "An example series",
      backdrop_path: "/placeholder.jpg",
      vote_average: 8.5,
      first_air_date: "2023-01-01",
      original_language: "en" // Add this property to fix the TypeScript error
    }
  ];

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="pt-24 px-4 md:px-8 pb-16">
        <ProfileHeader username={user?.user_metadata?.name || user?.email || 'Usuário'} />
        
        <div className="mt-8">
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900 border border-gray-800">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="favorites">Favoritos</TabsTrigger>
              <TabsTrigger value="subscription">Assinatura</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <ProfileTab user={user} />
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-6">
              <FavoritesTab favorites={mockFavorites} />
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-6">
              <SubscriptionTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
