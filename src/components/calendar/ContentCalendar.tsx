
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContentCalendar } from "@/hooks/useContentCalendar";
import CalendarTabContent from "./CalendarTabContent";
import CalendarCompact from "./CalendarCompact";
import CalendarFooter from "./CalendarFooter";
import { ContentCalendarItem } from "@/types/calendar";

interface ContentCalendarProps {
  compact?: boolean;
}

const ContentCalendar = ({ compact = false }: ContentCalendarProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("today");
  const { 
    todayReleases, 
    recentContent, 
    upcomingContent, 
    isLoading 
  } = useContentCalendar();
  
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
  
  if (compact) {
    return <CalendarCompact 
      recentContent={recentContent}
      isLoading={isLoading}
      onMediaClick={handleMediaClick}
    />;
  }
  
  return (
    <div className="bg-black/20 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={24} className="text-primary" />
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
          <CalendarTabContent 
            isLoading={isLoading}
            items={todayReleases}
            onMediaClick={handleMediaClick}
            emptyMessage="Nenhum lançamento para hoje"
            skeletonCount={6}
          />
        </TabsContent>
        
        <TabsContent value="recent" className="pt-4">
          <CalendarTabContent 
            isLoading={isLoading}
            items={recentContent}
            onMediaClick={handleMediaClick}
            emptyMessage="Nenhum conteúdo recente disponível"
            skeletonCount={12}
          />
        </TabsContent>
        
        <TabsContent value="upcoming" className="pt-4">
          <CalendarTabContent 
            isLoading={isLoading}
            items={upcomingContent}
            onMediaClick={handleMediaClick}
            emptyMessage="Nenhum lançamento futuro disponível"
            skeletonCount={12}
          />
        </TabsContent>
      </Tabs>
      
      <CalendarFooter />
    </div>
  );
};

export default ContentCalendar;
