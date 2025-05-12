
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentCalendarItem } from "@/types/calendar";
import CalendarItemCard from "./CalendarItemCard";
import CalendarSkeletonGrid from "./CalendarSkeletonGrid";

interface CalendarCompactProps {
  recentContent: ContentCalendarItem[];
  isLoading: boolean;
  onMediaClick: (media: ContentCalendarItem) => void;
}

const CalendarCompact = ({ 
  recentContent, 
  isLoading, 
  onMediaClick 
}: CalendarCompactProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays size={20} className="text-primary" />
        <h2 className="text-lg font-bold">Lançamentos Recentes</h2>
      </div>
      
      {isLoading ? (
        <CalendarSkeletonGrid count={6} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {recentContent.slice(0, 6).map((item) => (
            <CalendarItemCard 
              key={`${item.id}-${item.media_type}`} 
              item={item} 
              onClick={onMediaClick} 
            />
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
};

export default CalendarCompact;
