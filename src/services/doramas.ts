import { fetchSeriesDetails } from './tmdb/series';
import { Series } from '@/types/movie';

const DORAMAS_CACHE_KEY = 'doramas_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
const ITEMS_PER_PAGE = 50;
const BATCH_SIZE = 5;
const MAX_CACHE_SIZE = 100; // Limita o número de doramas em cache

// Função para verificar se uma série é um dorama coreano
const isKoreanDrama = (series: Series): boolean => {
  if (!series) return false;

  // Verifica se é uma série coreana
  const isKorean = series.original_language === 'ko';
  
  // Verifica se tem "drama" no nome original (em coreano)
  const hasKoreanDrama = series.original_name?.includes('드라마');
  
  // Verifica se tem gêneros relacionados a drama
  const hasDramaGenre = series.genres?.some(genre => 
    genre.name.toLowerCase().includes('drama') || 
    genre.name.toLowerCase().includes('dorama')
  );

  return isKorean && (hasKoreanDrama || hasDramaGenre);
};

// Função para ordenar doramas por popularidade
const sortByPopularity = (a: Series, b: Series): number => {
  return (b.popularity || 0) - (a.popularity || 0);
};

// Função para salvar no localStorage com tratamento de erro e limite de tamanho
const saveToLocalStorage = (key: string, data: any) => {
  try {
    // Limita o número de itens em cache
    if (Array.isArray(data.data)) {
      data.data = data.data.slice(0, MAX_CACHE_SIZE);
    }
    
    // Tenta salvar
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Erro ao salvar no localStorage:', error);
    // Se falhar, tenta limpar o cache antigo e salvar novamente
    try {
      localStorage.removeItem(key);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (retryError) {
      console.error('Falha ao salvar no localStorage após tentativa de limpeza:', retryError);
      // Se ainda falhar, limpa todo o localStorage e tenta uma última vez
      try {
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(data));
      } catch (finalError) {
        console.error('Falha final ao salvar no localStorage:', finalError);
      }
    }
  }
};

// Cache em memória para evitar recarregamentos
let memoryCache: { data: Series[], timestamp: number } | null = null;

export const getDoramas = async (page: number = 1): Promise<{ doramas: Series[], total: number }> => {
  try {
    // Primeiro tenta usar o cache em memória
    if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return {
        doramas: memoryCache.data.slice(start, end),
        total: memoryCache.data.length
      };
    }

    // Se não houver cache em memória, tenta o localStorage
    const cachedData = localStorage.getItem(DORAMAS_CACHE_KEY);
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        // Atualiza o cache em memória
        memoryCache = { data, timestamp };
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return {
          doramas: data.slice(start, end),
          total: data.length
        };
      }
    }

    // Se não houver cache válido, busca os dados da API
    const response = await fetch('/series.txt');
    if (!response.ok) {
      throw new Error('Falha ao carregar lista de séries');
    }

    const text = await response.text();
    const seriesIds = text.split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    console.log(`Buscando detalhes para ${seriesIds.length} séries...`);

    // Busca os detalhes de cada série em paralelo, com limite de concorrência
    const results: (Series | null)[] = [];
    let validSeriesCount = 0;

    for (let i = 0; i < seriesIds.length; i += BATCH_SIZE) {
      const batch = seriesIds.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (id) => {
          try {
            const series = await fetchSeriesDetails(id, 'pt-BR');
            if (series) {
              validSeriesCount++;
              return series;
            }
            return null;
          } catch (error) {
            // Ignora erros 404 e continua com as próximas séries
            if (error instanceof Error && error.message.includes('404')) {
              return null;
            }
            console.error(`Erro ao buscar série ${id}:`, error);
            return null;
          }
        })
      );
      results.push(...batchResults);
    }

    // Filtra apenas os doramas coreanos e remove resultados nulos
    const allDoramas = results
      .filter((series): series is Series => series !== null && isKoreanDrama(series))
      .sort(sortByPopularity);

    console.log(`Encontrados ${allDoramas.length} doramas válidos de ${validSeriesCount} séries processadas`);

    // Atualiza o cache em memória
    memoryCache = {
      data: allDoramas,
      timestamp: Date.now()
    };

    // Tenta salvar no localStorage
    saveToLocalStorage(DORAMAS_CACHE_KEY, memoryCache);

    // Retorna a página solicitada
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return {
      doramas: allDoramas.slice(start, end),
      total: allDoramas.length
    };
  } catch (error) {
    console.error('Erro ao buscar doramas:', error);
    return { doramas: [], total: 0 };
  }
}; 