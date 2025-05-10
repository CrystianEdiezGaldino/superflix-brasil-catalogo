import { fetchSeriesDetails } from './tmdb/series';
import { Series } from '@/types/movie';

const DORAMAS_CACHE_KEY = 'doramas_cache';

export const getDoramas = async (): Promise<Series[]> => {
  try {
    // Tenta ler do localStorage
    const cachedData = localStorage.getItem(DORAMAS_CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Se não houver cache, busca os dados da API
    const response = await fetch('/series.txt');
    const text = await response.text();
    const seriesIds = text.split('\n').filter(id => id.trim());

    const results = await Promise.all(
      seriesIds.map(id => fetchSeriesDetails(id.trim(), 'pt-BR'))
    );

    // Filtra apenas os doramas coreanos
    const doramas = results.filter(series => 
      series && series.original_language === 'ko'
    ) as Series[];

    // Salva no localStorage
    localStorage.setItem(DORAMAS_CACHE_KEY, JSON.stringify(doramas));

    return doramas;
  } catch (error) {
    console.error('Erro ao buscar doramas:', error);
    return [];
  }
}; 