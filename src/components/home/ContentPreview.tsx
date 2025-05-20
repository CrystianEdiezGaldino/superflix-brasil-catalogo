
import { useState } from "react";
import { MediaItem } from "@/types/movie";
import MediaSection from "@/components/MediaSection";
import { motion } from "framer-motion";

interface ContentPreviewProps {
  movies: MediaItem[];
  series: MediaItem[];
  anime: MediaItem[];
}

const ContentPreview = ({ movies, series, anime }: ContentPreviewProps) => {
  const [focusedItem, setFocusedItem] = useState(0);

  // Only show sections with content
  const hasMovies = movies.length > 0;
  const hasSeries = series.length > 0;
  const hasAnime = anime.length > 0;

  // If no content at all, don't render
  if (!hasMovies && !hasSeries && !hasAnime) {
    return null;
  }

  const handleFocusChange = (idx: number) => {
    setFocusedItem(idx);
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for each item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {hasMovies && (
        <motion.div variants={itemVariants}>
          <MediaSection
            key="movies-preview"
            title="Filmes"
            medias={movies}
            focusedItem={focusedItem}
            onFocusChange={handleFocusChange}
            sectionIndex={0}
          />
        </motion.div>
      )}

      {hasSeries && (
        <motion.div variants={itemVariants}>
          <MediaSection
            key="series-preview"
            title="Séries"
            medias={series}
            focusedItem={focusedItem}
            onFocusChange={handleFocusChange}
            sectionIndex={1}
          />
        </motion.div>
      )}

      {hasAnime && (
        <motion.div variants={itemVariants}>
          <MediaSection
            key="anime-preview"
            title="Anime"
            medias={anime}
            focusedItem={focusedItem}
            onFocusChange={handleFocusChange}
            sectionIndex={2}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContentPreview;
