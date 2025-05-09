
import { useRef, useState } from "react";
import { MediaItem } from "@/types/movie";
import MediaCard from "@/components/MediaCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MediaSectionProps {
  title: string;
  medias: MediaItem[];
  viewAllPath?: string;
  mediaType?: string;
}

const MediaSection = ({ title, medias }: MediaSectionProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === "left" 
        ? -current.clientWidth * 0.75
        : current.clientWidth * 0.75;
      
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!rowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setShowLeftArrow(scrollLeft > 20);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);
  };

  if (!medias || medias.length === 0) {
    return null;
  }

  return (
    <section className="py-6 px-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      </div>
      
      <div className="relative">
        {showLeftArrow && (
          <Button 
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 rounded-full h-10 w-10 shadow-lg opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}
          >
            <ChevronLeft size={20} className="text-white" />
          </Button>
        )}
        
        <div 
          ref={rowRef} 
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={handleScroll}
        >
          {medias.map((media) => (
            <div key={`${media.media_type}-${media.id}`} className="flex-none w-[160px] md:w-[200px] transition-transform hover:scale-105 duration-300">
              <MediaCard media={media} />
            </div>
          ))}
        </div>
        
        {showRightArrow && (
          <Button 
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 rounded-full h-10 w-10 shadow-lg opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}
          >
            <ChevronRight size={20} className="text-white" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default MediaSection;
