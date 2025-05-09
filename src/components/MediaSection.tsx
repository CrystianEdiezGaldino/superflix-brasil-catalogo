
import { useRef } from "react";
import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaSectionProps {
  title: string;
  medias: MediaItem[];
}

const MediaSection = ({ title, medias }: MediaSectionProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === "left" 
        ? -current.offsetWidth * 0.75 
        : current.offsetWidth * 0.75;
      
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!medias || medias.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white pl-4">{title}</h2>
      
      <div className="relative group">
        <Button 
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={20} />
        </Button>
        
        <div 
          ref={rowRef} 
          className="flex space-x-4 overflow-x-scroll pb-4 scrollbar-hide px-4"
        >
          {medias.map((media) => (
            <div key={`${media.media_type}-${media.id}`} className="flex-none w-[160px] md:w-[200px]">
              <MediaCard media={media} />
            </div>
          ))}
        </div>
        
        <Button 
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </section>
  );
};

export default MediaSection;
