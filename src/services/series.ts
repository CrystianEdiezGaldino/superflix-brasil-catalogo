import { Series } from '@/types/movie';
import { fetchSeriesDetails } from './tmdb/series';

const SERIES_PER_PAGE = 10;
const SERIES_CACHE_KEY = 'series_cache';
const PRIORITY_SERIES_ID = '100088';

interface SeriesResponse {
  series: Series[];
  total: number;
}

export const getSeries = async (page: number = 1): Promise<SeriesResponse> => {
  try {
    // Tenta obter do cache primeiro
    const cachedData = localStorage.getItem(SERIES_CACHE_KEY);
    let allSeries: Series[] = [];
    
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        allSeries = Array.isArray(parsedData) ? parsedData : [];
      } catch (e) {
        console.error('Erro ao fazer parse do cache:', e);
        allSeries = [];
      }
    }

    if (!allSeries.length) {
      // Se não houver cache ou cache inválido, busca do arquivo
      const response = await fetch('/todas_as_series.txt');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const seriesIds = text.split('\n').filter(id => id.trim());

      // Busca detalhes das séries em lotes para evitar sobrecarga
      const batchSize = 10;
      for (let i = 0; i < seriesIds.length; i += batchSize) {
        const batch = seriesIds.slice(i, i + batchSize);
        const batchPromises = batch.map(id => fetchSeriesDetails(id, 'pt-BR'));
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(series => series && series.id);
        allSeries = [...allSeries, ...validResults];
      }

      // Filtra apenas séries que não são doramas (não são coreanas)
      allSeries = allSeries.filter(series => series.original_language !== 'ko');

      // Ordena por rating e coloca a série prioritária no início
      allSeries.sort((a, b) => {
        if (a.id.toString() === PRIORITY_SERIES_ID) return -1;
        if (b.id.toString() === PRIORITY_SERIES_ID) return 1;
        return (b.vote_average || 0) - (a.vote_average || 0);
      });

      // Salva no cache
      try {
        localStorage.setItem(SERIES_CACHE_KEY, JSON.stringify(allSeries));
      } catch (e) {
        console.error('Erro ao salvar no cache:', e);
      }
    }

    // Garante que allSeries é um array antes de usar slice
    if (!Array.isArray(allSeries)) {
      console.error('allSeries não é um array:', allSeries);
      return { series: [], total: 0 };
    }

    // Retorna a página solicitada
    const start = (page - 1) * SERIES_PER_PAGE;
    const end = start + SERIES_PER_PAGE;
    return {
      series: allSeries.slice(start, end),
      total: allSeries.length
    };
  } catch (error) {
    console.error('Erro ao carregar séries:', error);
    return { series: [], total: 0 };
  }
}; 