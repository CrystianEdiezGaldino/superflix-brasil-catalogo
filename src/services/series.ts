import { Series } from '@/types/movie';
import { fetchSeriesDetails } from './tmdb/series';

const SERIES_PER_PAGE = 50;
const SERIES_CACHE_KEY = 'series_cache';

export const getSeries = async (page: number = 1): Promise<Series[]> => {
  try {
    // Tenta obter do cache primeiro
    const cachedData = localStorage.getItem(SERIES_CACHE_KEY);
    let allSeries: Series[] = [];
    
    if (cachedData) {
      allSeries = JSON.parse(cachedData);
    } else {
      // Se não houver cache, busca do arquivo
      const response = await fetch('/todas_as_series.txt');
      const text = await response.text();
      const seriesIds = text.split('\n').filter(id => id.trim());

      // Busca detalhes das séries
      const seriesPromises = seriesIds.map(id => fetchSeriesDetails(id, 'pt-BR'));
      allSeries = await Promise.all(seriesPromises);

      // Filtra apenas séries que não são doramas (não são coreanas)
      allSeries = allSeries.filter(series => series.original_language !== 'ko');

      // Salva no cache
      localStorage.setItem(SERIES_CACHE_KEY, JSON.stringify(allSeries));
    }

    // Retorna a página solicitada
    const start = (page - 1) * SERIES_PER_PAGE;
    const end = start + SERIES_PER_PAGE;
    return allSeries.slice(start, end);
  } catch (error) {
    console.error('Erro ao carregar séries:', error);
    return [];
  }
}; 