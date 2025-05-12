
import { isMovie, isSeries } from "@/types/movie";
import { ContentCalendarItem } from "@/types/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarItemCardProps {
  item: ContentCalendarItem;
  onClick: (item: ContentCalendarItem) => void;
}

const CalendarItemCard = ({ item, onClick }: CalendarItemCardProps) => {
  // Format the release date
  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return "Data desconhecida";
    try {
      return format(new Date(dateString), "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      return "Data desconhecida";
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
      onClick={() => onClick(item)}
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
        <p className="text-xs text-gray-400">
          {formatReleaseDate(item.release_date || item.first_air_date || '')}
        </p>
      </CardContent>
    </Card>
  );
};

export default CalendarItemCard;
