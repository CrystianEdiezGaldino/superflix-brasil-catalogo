
import { ContentCalendarItem } from "@/types/calendar";
import CalendarItemCard from "./CalendarItemCard";
import CalendarSkeletonGrid from "./CalendarSkeletonGrid";

interface CalendarTabContentProps {
  isLoading: boolean;
  items: ContentCalendarItem[];
  onMediaClick: (media: ContentCalendarItem) => void;
  emptyMessage?: string;
  skeletonCount?: number;
}

const CalendarTabContent = ({ 
  isLoading, 
  items, 
  onMediaClick, 
  emptyMessage = "Nenhum conteúdo disponível",
  skeletonCount = 12
}: CalendarTabContentProps) => {
  if (isLoading) {
    return <CalendarSkeletonGrid count={skeletonCount} />;
  }
  
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {items.map((item) => (
        <CalendarItemCard 
          key={`${item.id}-${item.media_type}`} 
          item={item} 
          onClick={onMediaClick} 
        />
      ))}
    </div>
  );
};

export default CalendarTabContent;
