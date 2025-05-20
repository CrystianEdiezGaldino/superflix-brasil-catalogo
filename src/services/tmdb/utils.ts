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
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    if (!data) {
      throw new Error('Resposta vazia da API');
    }
    return data;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error("Fetch error:", error);
    throw error;
  }
}

// Add media type to API results
export function addMediaTypeToResults<T extends { media_type?: string }>(
  results: T[] | undefined, 
  type: "movie" | "tv"
): T[] {
  if (!results) return [];
  return results.map((item) => ({
    ...item,
    media_type: type
  }));
}

// Helper to limit results based on pagination
export function limitResults<T>(results: T[], itemsPerPage: number = 20): T[] {
  if (!results) return [];
  return results.slice(0, itemsPerPage);
}
