const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
    const data = await response.json();
    
    // Add media_type to each movie
    const moviesWithType = data.results.map((movie: any) => ({
      ...movie,
      media_type: "movie"
    }));
    
    return moviesWithType;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const searchMedia = async (query: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&language=pt-BR&query=${query}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
};

export const fetchMovieDetails = async (id: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

export const fetchSeriesDetails = async (id: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching series details:", error);
    return null;
  }
};

export const fetchSeriesSeasonDetails = async (id: string, seasonNumber: number) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching series season details:", error);
    return null;
  }
};

export const fetchTopRatedAnime = async () => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_genres=16&sort_by=vote_average.desc&vote_count.gte=10`);
    const data = await response.json();
    
    // Add media_type to each TV series
    const animeWithType = data.results.map((anime: any) => ({
      ...anime,
      media_type: "tv"
    }));
    
    return animeWithType;
  } catch (error) {
    console.error("Error fetching top rated anime:", error);
    return [];
  }
};

export const fetchSpecificAnimeRecommendations = async () => {
    try {
        // Using specific keywords and genres associated with anime
        const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_keywords=210024&sort_by=popularity.desc`);
        const data = await response.json();
        
        // Add media_type to each TV series
        const animeWithType = data.results.map((anime: any) => ({
          ...anime,
          media_type: "tv"
        }));
        
        return animeWithType;
    } catch (error) {
        console.error("Error fetching specific anime recommendations:", error);
        return [];
    }
};

// New function to fetch popular series with pagination and items per page
export const fetchPopularSeries = async (page = 1, itemsPerPage = 20) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
    const data = await response.json();
    
    // Map to add media_type to each TV series
    const seriesWithType = data.results.map((series: any) => ({
      ...series,
      media_type: "tv"
    }));
    
    // Limit results based on itemsPerPage
    return seriesWithType.slice(0, itemsPerPage);
  } catch (error) {
    console.error("Error fetching popular series:", error);
    return [];
  }
};

// Update anime fetch to include pagination and items per page
export const fetchAnime = async (page = 1, itemsPerPage = 20) => {
  try {
    // Using specific keywords and genres associated with anime
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_keywords=210024&page=${page}`);
    const data = await response.json();
    
    // Map to add media_type to each TV series
    const animeWithType = data.results.map((anime: any) => ({
      ...anime,
      media_type: "tv"
    }));
    
    // Limit results based on itemsPerPage
    return animeWithType.slice(0, itemsPerPage);
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};

// New function to fetch recommendations based on a media item
export const fetchRecommendations = async (mediaType: string, id: string) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${API_KEY}&language=pt-BR`);
    const data = await response.json();
    
    // Add media_type to each recommended item
    const recommendationsWithType = data.results.map((item: any) => ({
      ...item,
      media_type: mediaType === 'movie' ? 'movie' : 'tv'
    }));
    
    return recommendationsWithType;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

// New function to fetch doramas (Korean dramas)
export const fetchDoramas = async (page = 1, itemsPerPage = 20) => {
  try {
    // Using specific regions and keywords associated with doramas
    const response = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=pt-BR&with_original_language=ko&page=${page}`);
    const data = await response.json();
    
    // Map to add media_type to each TV series
    const doramaWithType = data.results.map((dorama: any) => ({
      ...dorama,
      media_type: "tv"
    }));
    
    // Limit results based on itemsPerPage
    return doramaWithType.slice(0, itemsPerPage);
  } catch (error) {
    console.error("Error fetching doramas:", error);
    return [];
  }
};
