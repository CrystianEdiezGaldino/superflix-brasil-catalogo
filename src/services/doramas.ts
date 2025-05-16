import { fetchSeriesDetails } from './tmdb/series';
import { Series } from '@/types/movie';

const DORAMAS_CACHE_KEY = 'doramas_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos
const ITEMS_PER_PAGE = 20; // Reduzindo para 20 itens por página
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

export const getDoramas = async (page: number = 1): Promise<{ doramas: Series[], total: number, isComplete: boolean }> => {
  try {
    // Primeiro tenta usar o cache em memória
    if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return {
        doramas: memoryCache.data.slice(start, end),
        total: memoryCache.data.length,
        isComplete: true
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
          total: data.length,
          isComplete: true
        };
      }
    }

    // Se não houver cache válido, busca os dados da API
    console.log('Buscando dados da API...');
    const response = await fetch('/series.txt');
    if (!response.ok) {
      console.error('Erro ao carregar series.txt:', response.status);
      throw new Error('Falha ao carregar lista de séries');
    }

    const text = await response.text();
    const seriesIds = text.split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    console.log(`IDs de séries encontrados: ${seriesIds.length}`);

    // Se for a primeira página, retorna imediatamente com os primeiros 20 itens
    if (page === 1) {
      const firstBatch = seriesIds.slice(0, BATCH_SIZE);
      const firstResults = await Promise.all(
        firstBatch.map(async (id) => {
          try {
            const series = await fetchSeriesDetails(id, 'pt-BR');
            return series;
          } catch (error) {
            console.error(`Erro ao buscar série ${id}:`, error);
            return null;
          }
        })
      );

      const firstDoramas = firstResults
        .filter((series): series is Series => {
          if (!series) return false;
          const isKorean = series.original_language === 'ko';
          const hasDramaGenre = series.genres?.some(genre => 
            genre.name.toLowerCase().includes('drama') || 
            genre.name.toLowerCase().includes('dorama')
          );
          return isKorean && hasDramaGenre;
        })
        .sort(sortByPopularity);

      // Inicia o processamento em background do resto dos dados
      processRemainingDoramas(seriesIds.slice(BATCH_SIZE));

      return {
        doramas: firstDoramas,
        total: seriesIds.length,
        isComplete: false
      };
    }

    // Para páginas subsequentes, retorna os próximos 20 itens do cache em memória
    if (memoryCache) {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return {
        doramas: memoryCache.data.slice(start, end),
        total: memoryCache.data.length,
        isComplete: true
      };
    }

    return {
      doramas: [],
      total: 0,
      isComplete: false
    };
  } catch (error) {
    console.error('Erro ao buscar doramas:', error);
    return { doramas: [], total: 0, isComplete: false };
  }
};

// Função para processar o resto dos doramas em background
const processRemainingDoramas = async (remainingIds: string[]) => {
  const results: (Series | null)[] = [];
  let validSeriesCount = 0;

  for (let i = 0; i < remainingIds.length; i += BATCH_SIZE) {
    const batch = remainingIds.slice(i, i + BATCH_SIZE);
    console.log(`Processando lote ${i/BATCH_SIZE + 1} de ${Math.ceil(remainingIds.length/BATCH_SIZE)}`);
    
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
          if (error instanceof Error && error.message.includes('404')) {
            return null;
          }
          console.error(`Erro ao buscar série ${id}:`, error);
          return null;
        }
      })
    );
    results.push(...batchResults);

    // Atualiza o cache em memória a cada lote processado
    const allDoramas = results
      .filter((series): series is Series => {
        if (!series) return false;
        const isKorean = series.original_language === 'ko';
        const hasDramaGenre = series.genres?.some(genre => 
          genre.name.toLowerCase().includes('drama') || 
          genre.name.toLowerCase().includes('dorama')
        );
        return isKorean && hasDramaGenre;
      })
      .sort(sortByPopularity);

    memoryCache = {
      data: allDoramas,
      timestamp: Date.now()
    };

    saveToLocalStorage(DORAMAS_CACHE_KEY, memoryCache);
  }

  console.log(`Processamento em background concluído. Total de doramas: ${memoryCache?.data.length || 0}`);
}; 