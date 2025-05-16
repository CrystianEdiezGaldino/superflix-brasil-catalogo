import { fetchSeriesDetails } from './tmdb/series';
import { Series } from '@/types/movie';

const BATCH_SIZE = 5;
const INITIAL_DISPLAY_SIZE = 20;

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

// Buffer para armazenar doramas processados
let processedDoramas: Series[] = [];
let isProcessingComplete = false;

export const getDoramas = async (onUpdate?: (doramas: Series[], total: number) => void): Promise<{ doramas: Series[], total: number, isComplete: boolean }> => {
  try {
    // Se já temos todos os doramas processados, retorna do buffer
    if (isProcessingComplete) {
      return {
        doramas: processedDoramas,
        total: processedDoramas.length,
        isComplete: true
      };
    }

    // Se não temos doramas processados, inicia o processamento
    if (processedDoramas.length === 0) {
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

      // Processa os primeiros 20 imediatamente
      const firstBatch = seriesIds.slice(0, INITIAL_DISPLAY_SIZE);
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
          return isKoreanDrama(series);
        });

      processedDoramas = firstDoramas;

      // Notifica a UI com os primeiros doramas
      if (onUpdate) {
        onUpdate(firstDoramas, seriesIds.length);
      }

      // Inicia o processamento do resto em background
      processRemainingDoramas(seriesIds, onUpdate);

      return {
        doramas: firstDoramas,
        total: seriesIds.length,
        isComplete: false
      };
    }

    // Se temos alguns doramas mas não todos, retorna o que temos até agora
    return {
      doramas: processedDoramas,
      total: processedDoramas.length,
      isComplete: false
    };
  } catch (error) {
    console.error('Erro ao buscar doramas:', error);
    return { doramas: [], total: 0, isComplete: false };
  }
};

// Função para processar o resto dos doramas em background
const processRemainingDoramas = async (seriesIds: string[], onUpdate?: (doramas: Series[], total: number) => void) => {
  const results: (Series | null)[] = [...processedDoramas];
  let validSeriesCount = processedDoramas.length;

  for (let i = INITIAL_DISPLAY_SIZE; i < seriesIds.length; i += BATCH_SIZE) {
    const batch = seriesIds.slice(i, i + BATCH_SIZE);
    console.log(`Processando lote ${Math.floor(i/BATCH_SIZE) + 1} de ${Math.ceil(seriesIds.length/BATCH_SIZE)}`);
    
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

    // Filtra apenas os novos doramas válidos
    const newDoramas = batchResults
      .filter((series): series is Series => {
        if (!series) return false;
        return isKoreanDrama(series);
      });

    // Adiciona os novos doramas ao final da lista
    processedDoramas = [...processedDoramas, ...newDoramas];

    // Notifica a UI com todos os doramas processados até agora
    if (onUpdate) {
      onUpdate(processedDoramas, seriesIds.length);
    }
  }

  isProcessingComplete = true;
  console.log(`Processamento concluído. Total de doramas: ${processedDoramas.length}`);
}; 