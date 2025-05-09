
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { fetchKoreanDramas } from "@/services/tmdbApi";
import MediaCard from "@/components/MediaCard";
import { Series } from "@/types/movie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Doramas = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: doramas, isLoading, error } = useQuery({
    queryKey: ["koreanDramas"],
    queryFn: fetchKoreanDramas
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (error) {
    toast.error("Erro ao carregar dados dos doramas");
  }

  return (
    <div className="min-h-screen bg-netflix-background">
      <Navbar onSearch={handleSearch} />
      
      <div className="container max-w-full pt-28 pb-20 px-4">
        <h1 className="text-white text-3xl font-bold mb-8">Doramas</h1>
        
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-black/40 border border-white/10">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="romantic">Românticos</TabsTrigger>
            <TabsTrigger value="action">Ação</TabsTrigger>
            <TabsTrigger value="thriller">Thriller</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {doramas?.map((dorama: Series, index) => (
                  <div 
                    key={dorama.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <MediaCard media={dorama} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="romantic" className="mt-6">
            <Card className="p-8 bg-black/40 border border-white/10 text-center">
              <h3 className="text-xl mb-4">Doramas Românticos</h3>
              <p className="text-gray-400">Os melhores doramas românticos em breve!</p>
              <Button variant="outline" className="mt-4 border-netflix-red text-white hover:bg-netflix-red hover:text-white">
                Explorar outros
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="action" className="mt-6">
            <Card className="p-8 bg-black/40 border border-white/10 text-center">
              <h3 className="text-xl mb-4">Doramas de Ação</h3>
              <p className="text-gray-400">Os melhores doramas de ação em breve!</p>
              <Button variant="outline" className="mt-4 border-netflix-red text-white hover:bg-netflix-red hover:text-white">
                Explorar outros
              </Button>
            </Card>
          </TabsContent>
          
          <TabsContent value="thriller" className="mt-6">
            <Card className="p-8 bg-black/40 border border-white/10 text-center">
              <h3 className="text-xl mb-4">Doramas de Thriller</h3>
              <p className="text-gray-400">Os melhores doramas de thriller em breve!</p>
              <Button variant="outline" className="mt-4 border-netflix-red text-white hover:bg-netflix-red hover:text-white">
                Explorar outros
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
        
        <section className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-4">Doramas Populares</h2>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {doramas?.slice(0, 12).map((dorama: Series) => (
                <MediaCard key={dorama.id} media={dorama} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Doramas;
