
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Calendar, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentCalendar, ContentCalendarItem } from "@/hooks/useContentCalendar";
import { Skeleton } from "@/components/ui/skeleton";
import { isMovie, isSeries } from "@/types/movie";

interface ContentCalendarProps {
  compact?: boolean;
}

const ContentCalendar = ({ compact = false }: ContentCalendarProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const { calendarItems, upcomingContent, recentContent, todayReleases, isLoading } = useContentCalendar();
  
  // Handle media click to navigate to the correct detail page
  const handleMediaClick = (media: ContentCalendarItem) => {
    if (!media.id) return;
    
    if (media.media_type === 'tv') {
      if (media.original_language === 'ko') {
        navigate(`/dorama/${media.id}`);
      } else if (media.original_language === 'ja') {
        navigate(`/anime/${media.id}`);
      } else {
        navigate(`/serie/${media.id}`);
      }
    } else {
      navigate(`/filme/${media.id}`);
    }
  };
  
  // Format the release date
  const formatReleaseDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return "Data desconhecida";
    }
  };
  
  // Create a calendar item card component
  const CalendarItemCard = ({ item }: { item: ContentCalendarItem }) => (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
      onClick={() => handleMediaClick(item)}
    >
      <div className="relative">
        <img 
          src={`https://image.tmdb.org/t/p/w342${item.poster_path || item.backdrop_path}`} 
          alt={isMovie(item) ? item.title : isSeries(item) ? item.name : 'Mídia'}
          className="w-full aspect-[2/3] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        {item.is_new && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-bold">
            NOVO
          </div>
        )}
      </div>
      
      <CardContent className="p-3">
        <h3 className="text-sm font-medium truncate">
          {isMovie(item) ? item.title : isSeries(item) ? item.name : 'Título Desconhecido'}
        </h3>
        <p className="text-xs text-gray-400">{formatReleaseDate(item.release_date)}</p>
      </CardContent>
    </Card>
  );
  
  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CalendarDays size={20} className="text-primary" />
          <h2 className="text-lg font-bold">Lançamentos Recentes</h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {recentContent.slice(0, 6).map((item) => (
              <CalendarItemCard key={`${item.id}-${item.media_type}-${item.release_date}`} item={item} />
            ))}
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            className="text-primary border-primary hover:bg-primary/10"
            onClick={() => navigate("/calendario")}
          >
            Ver todos os lançamentos
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-black/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-primary" />
          <h2 className="text-xl font-bold">Calendário de Lançamentos</h2>
        </div>
      </div>
      
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="upcoming">Em Breve</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : todayReleases.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {todayReleases.map((item) => (
                <CalendarItemCard key={`${item.id}-${item.media_type}-${item.release_date}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum lançamento para hoje</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : recentContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recentContent.map((item) => (
                <CalendarItemCard key={`${item.id}-${item.media_type}-${item.release_date}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum conteúdo recente disponível</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="pt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="w-full aspect-[2/3] rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : upcomingContent.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {upcomingContent.map((item) => (
                <CalendarItemCard key={`${item.id}-${item.media_type}-${item.release_date}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Nenhum lançamento futuro disponível</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="text-xs text-gray-500 mt-2">
        <p>• Este calendário mostra lançamentos de até 45 dias atrás e 20 dias à frente do dia atual.</p>
        <p>• Exibe apenas animes/séries em andamento. Para conteúdo completo, acesse /conteudo.</p>
        <p>• Alguns episódios levam até 24h para aparecer, pois dependem de postagens do país de exibição.</p>
        <p>• Horários podem variar conforme o fuso horário do país de origem.</p>
      </div>
    </div>
  );
};

export default ContentCalendar;
