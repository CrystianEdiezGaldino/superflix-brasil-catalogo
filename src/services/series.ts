
import { Series } from '@/types/movie';
import { fetchSeriesDetails } from './tmdb/series';
import { toast } from 'sonner';

const SERIES_PER_PAGE = 10;
const SERIES_CACHE_KEY = 'series_cache';
const PRIORITY_SERIES_ID = '100088';
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 horas em ms

interface SeriesResponse {
  series: Series[];
  total: number;
}

export const getSeries = async (page: number = 1): Promise<SeriesResponse> => {
  try {
    // Verificar se existe cache válido
    const now = new Date().getTime();
    const cachedInfo = localStorage.getItem(`${SERIES_CACHE_KEY}_info`);
    const cachedData = localStorage.getItem(SERIES_CACHE_KEY);
    let shouldRefetch = true;
    let allSeries: Series[] = [];
    
    // Verificar se o cache é válido
    if (cachedInfo && cachedData) {
      try {
        const { timestamp } = JSON.parse(cachedInfo);
        if (now - timestamp < CACHE_EXPIRATION) {
          const parsedData = JSON.parse(cachedData);
          allSeries = Array.isArray(parsedData) ? parsedData : [];
          shouldRefetch = false;
        }
      } catch (e) {
        console.error('Erro ao fazer parse do cache:', e);
        shouldRefetch = true;
      }
    }

    // Se não houver cache válido, buscar dados
    if (shouldRefetch || allSeries.length === 0) {
      try {
        // Tentar buscar do arquivo local em dev ou API em prod
        const isProduction = import.meta.env.PROD;
        
        if (isProduction) {
          // Em produção, usar IDs fixos para buscar da API TMDB
          const popularSeriesIds = [
            2, 3, 6, 10, 1402, 60735, 1396, 1399, 46648, 71712, 90669, 66732, 97546
          ];
          
          // Buscar detalhes das séries em lotes para evitar sobrecarga
          const batchSize = 5;
          for (let i = 0; i < popularSeriesIds.length; i += batchSize) {
            const batch = popularSeriesIds.slice(i, i + batchSize);
            const batchPromises = batch.map(id => fetchSeriesDetails(id.toString(), 'pt-BR'));
            const batchResults = await Promise.all(batchPromises);
            const validResults = batchResults.filter(series => series && series.id);
            allSeries = [...allSeries, ...validResults];
          }
        } else {
          // Em desenvolvimento, tentar buscar do arquivo local
          const response = await fetch('/todas_as_series.txt');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const text = await response.text();
          const seriesIds = text.split('\n').filter(id => id && id.trim());

          // Limitar o número de séries em desenvolvimento para performance
          const limitedIds = seriesIds.slice(0, 30);
          
          // Buscar detalhes das séries em lotes
          const batchSize = 5;
          for (let i = 0; i < limitedIds.length; i += batchSize) {
            const batch = limitedIds.slice(i, i + batchSize);
            const batchPromises = batch.map(id => fetchSeriesDetails(id, 'pt-BR'));
            const batchResults = await Promise.all(batchPromises);
            const validResults = batchResults.filter(series => series && series.id);
            allSeries = [...allSeries, ...validResults];
          }
        }
        
        // Adicionar popularity se não existir
        allSeries = allSeries.map(series => ({
          ...series,
          popularity: series.popularity || Math.random() * 100
        }));
        
        // Filtrar apenas séries que não são doramas (não são coreanas)
        allSeries = allSeries.filter(series => series && series.original_language !== 'ko');

        // Ordena por rating e coloca a série prioritária no início
        allSeries.sort((a, b) => {
          if (a && a.id && a.id.toString() === PRIORITY_SERIES_ID) return -1;
          if (b && b.id && b.id.toString() === PRIORITY_SERIES_ID) return 1;
          return ((b && b.vote_average) || 0) - ((a && a.vote_average) || 0);
        });

        // Salva no cache com timestamp
        try {
          localStorage.setItem(SERIES_CACHE_KEY, JSON.stringify(allSeries));
          localStorage.setItem(`${SERIES_CACHE_KEY}_info`, JSON.stringify({ timestamp: now }));
        } catch (e) {
          console.error('Erro ao salvar no cache:', e);
        }
      } catch (fetchError) {
        // Se falhar em buscar dados novos, tentar usar o cache mesmo expirado
        console.error('Erro ao buscar séries novas:', fetchError);
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            allSeries = Array.isArray(parsedData) ? parsedData : [];
            toast.error("Erro ao buscar novas séries. Usando dados em cache.");
          } catch (e) {
            console.error('Erro ao usar cache expirado:', e);
            allSeries = [];
          }
        }
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
    toast.error("Erro ao carregar séries. Tente novamente mais tarde.");
    return { series: [], total: 0 };
  }
};
