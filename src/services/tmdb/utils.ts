
import { API_KEY, BASE_URL, DEFAULT_LANGUAGE } from "./config";

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string, additionalParams: string = "") => {
  return `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=${DEFAULT_LANGUAGE}${additionalParams}`;
};

// Helper for fetch requests with error handling
export async function fetchFromApi<T>(url: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      console.error(`API Error: ${response.status} for URL: ${url}`);
      return {} as T;
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error("Fetch error:", error);
    return {} as T;
  }
}

// Add media type to API results
export function addMediaTypeToResults<T extends { media_type?: string }>(
  results: T[] | undefined, 
  type: "movie" | "tv"
): T[] {
  return results?.map((item) => ({
    ...item,
    media_type: type
  })) || [];
}

// Helper to limit results based on pagination
export function limitResults<T>(results: T[], itemsPerPage: number = 20): T[] {
  return results.slice(0, itemsPerPage);
}

// Helper to create a programming guide (mockado para TV)
export function generateMockProgramming(channelName: string) {
  const now = new Date();
  const hours = now.getHours();
  
  const programs = [];
  
  // Programa atual
  programs.push({
    startTime: `${hours}:00`,
    endTime: `${hours + 1}:30`,
    title: `Programa de ${hours}h às ${hours + 1}h30`,
    description: `Conteúdo especial em ${channelName}`
  });
  
  // Próximos programas
  for (let i = 1; i <= 3; i++) {
    const nextHour = hours + Math.floor(i * 1.5);
    const endHour = nextHour + 1 + (i % 2);
    
    programs.push({
      startTime: `${nextHour % 24}:${i % 2 ? '30' : '00'}`,
      endTime: `${endHour % 24}:${i % 2 ? '00' : '30'}`,
      title: `Programa de ${nextHour % 24}h às ${endHour % 24}h`,
      description: `Conteúdo em ${channelName}`
    });
  }
  
  return programs;
}
