
import { buildApiUrl, fetchFromApi } from "./utils";

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  size: number;
}

interface VideoResponse {
  id: number;
  results: Video[];
}

// Fetch videos (trailers, teasers) for a TV show
export const fetchTVVideos = async (tvId: number): Promise<Video[]> => {
  try {
    const url = buildApiUrl(`/tv/${tvId}/videos`);
    const data = await fetchFromApi<VideoResponse>(url);
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV videos:", error);
    return [];
  }
};

// Get the best trailer or teaser for a TV show
export const getBestTVVideoKey = (videos: Video[]): string | undefined => {
  if (!videos || videos.length === 0) return undefined;

  // Filter YouTube videos only
  const youtubeVideos = videos.filter(video => video.site === "YouTube");
  
  // Priority order: Official Trailer > Trailer > Teaser > Other
  const officialTrailers = youtubeVideos.filter(
    video => video.type === "Trailer" && video.official
  );
  
  const trailers = youtubeVideos.filter(
    video => video.type === "Trailer"
  );
  
  const teasers = youtubeVideos.filter(
    video => video.type === "Teaser"
  );

  // Return the first video found based on priority
  if (officialTrailers.length > 0) return officialTrailers[0].key;
  if (trailers.length > 0) return trailers[0].key;
  if (teasers.length > 0) return teasers[0].key;
  
  // If no trailers or teasers, return first YouTube video
  if (youtubeVideos.length > 0) return youtubeVideos[0].key;
  
  // No suitable videos found
  return undefined;
};
