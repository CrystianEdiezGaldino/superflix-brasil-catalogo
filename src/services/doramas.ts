import { fetchSeriesDetails } from './tmdb/series';
import { Series } from '@/types/movie';

const BATCH_SIZE = 5;
const INITIAL_DISPLAY_SIZE = 20;

// Estado global do processamento
interface ProcessingState {
  isProcessing: boolean;
  isPaused: boolean;
  currentBatch: number;
  totalBatches: number;
  processedCount: number;
  totalCount: number;
  lastProcessedIndex: number;
}

let processingState: ProcessingState = {
  isProcessing: false,
  isPaused: false,
  currentBatch: 0,
  totalBatches: 0,
  processedCount: 0,
  totalCount: 0,
  lastProcessedIndex: 0
};

// Buffer para armazenar doramas processados
let processedDoramas: Series[] = [];
let currentAbortController: AbortController | null = null;
let seriesIds: string[] = [];

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

// Função para pausar o processamento
export const pauseDoramasProcessing = () => {
  console.log('Pausando processamento de doramas...');
  processingState.isPaused = true;
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
};

// Função para retomar o processamento
export const resumeDoramasProcessing = async (
  onUpdate?: (doramas: Series[], total: number) => void,
  signal?: AbortSignal
) => {
  if (!processingState.isPaused) return;

  console.log('Retomando processamento de doramas...');
  processingState.isPaused = false;
  processingState.isProcessing = true;

  // Cria um novo controller para este processamento
  currentAbortController = new AbortController();
  const currentSignal = signal || currentAbortController.signal;

  // Continua o processamento de onde parou
  await processRemainingDoramas(seriesIds, onUpdate, currentSignal);
};

// Função para resetar o estado global
const resetState = () => {
  console.log('Resetando estado do processamento...');
  processingState = {
    isProcessing: false,
    isPaused: false,
    currentBatch: 0,
    totalBatches: 0,
    processedCount: 0,
    totalCount: 0,
    lastProcessedIndex: 0
  };
  processedDoramas = [];
  seriesIds = [];
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;
  }
};

// Função para verificar se o processamento deve continuar
const shouldContinueProcessing = () => {
  return !processingState.isPaused && processingState.isProcessing;
};

export const getDoramas = async (
  onUpdate?: (doramas: Series[], total: number) => void,
  signal?: AbortSignal
): Promise<{ doramas: Series[], total: number, isComplete: boolean }> => {
  try {
    // Se o processamento está pausado, retoma de onde parou
    if (processingState.isPaused) {
      await resumeDoramasProcessing(onUpdate, signal);
      return {
        doramas: processedDoramas,
        total: processingState.totalCount,
        isComplete: false
      };
    }

    // Se já temos doramas processados, retorna eles
    if (processedDoramas.length > 0) {
      return {
        doramas: processedDoramas,
        total: processingState.totalCount,
        isComplete: false
      };
    }

    // Inicia um novo processamento
    processingState.isProcessing = true;
    processingState.isPaused = false;

    // Cria um novo controller para este processamento
    currentAbortController = new AbortController();
    const currentSignal = signal || currentAbortController.signal;

    console.log('Buscando dados da API...');
    const response = await fetch('/series.txt', { signal: currentSignal });
    if (!response.ok) {
      console.error('Erro ao carregar series.txt:', response.status);
      throw new Error('Falha ao carregar lista de séries');
    }

    const text = await response.text();
    seriesIds = text.split('\n')
      .map(id => id.trim())
      .filter(id => id.length > 0);

    console.log(`IDs de séries encontrados: ${seriesIds.length}`);
    
    // Atualiza o estado com o total de séries
    processingState.totalCount = seriesIds.length;
    processingState.totalBatches = Math.ceil(seriesIds.length / BATCH_SIZE);

    // Processa os primeiros 20 imediatamente
    const firstBatch = seriesIds.slice(0, INITIAL_DISPLAY_SIZE);
    const firstResults = await Promise.all(
      firstBatch.map(async (id) => {
        if (!shouldContinueProcessing()) return null;
        try {
          const series = await fetchSeriesDetails(id, 'pt-BR', currentSignal);
          processingState.processedCount++;
          return series;
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            throw error;
          }
          console.error(`Erro ao buscar série ${id}:`, error);
          return null;
        }
      })
    );

    if (!shouldContinueProcessing()) {
      return { doramas: [], total: 0, isComplete: false };
    }

    const firstDoramas = firstResults
      .filter((series): series is Series => {
        if (!series) return false;
        return isKoreanDrama(series);
      });

    processedDoramas = firstDoramas;
    processingState.lastProcessedIndex = INITIAL_DISPLAY_SIZE;

    // Notifica a UI com os primeiros doramas
    if (onUpdate && !currentSignal.aborted && shouldContinueProcessing()) {
      onUpdate(firstDoramas, seriesIds.length);
    }

    // Inicia o processamento do resto em background
    processRemainingDoramas(seriesIds, onUpdate, currentSignal);

    return {
      doramas: firstDoramas,
      total: seriesIds.length,
      isComplete: false
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Processamento pausado');
      return { doramas: processedDoramas, total: processingState.totalCount, isComplete: false };
    }
    console.error('Erro ao buscar doramas:', error);
    return { doramas: [], total: 0, isComplete: false };
  }
};

// Função para processar o resto dos doramas em background
const processRemainingDoramas = async (
  seriesIds: string[],
  onUpdate?: (doramas: Series[], total: number) => void,
  signal?: AbortSignal
) => {
  for (let i = processingState.lastProcessedIndex; i < seriesIds.length; i += BATCH_SIZE) {
    if (!shouldContinueProcessing()) {
      console.log('Processamento pausado durante o loop');
      return;
    }

    processingState.currentBatch = Math.floor(i / BATCH_SIZE) + 1;
    const batch = seriesIds.slice(i, i + BATCH_SIZE);
    console.log(`Processando lote ${processingState.currentBatch} de ${processingState.totalBatches}`);
    
    const batchResults = await Promise.all(
      batch.map(async (id) => {
        if (!shouldContinueProcessing()) return null;
        try {
          const series = await fetchSeriesDetails(id, 'pt-BR', signal);
          processingState.processedCount++;
          return series;
        } catch (error) {
          if (error instanceof Error && error.name === 'AbortError') {
            throw error;
          }
          if (error instanceof Error && error.message.includes('404')) {
            return null;
          }
          console.error(`Erro ao buscar série ${id}:`, error);
          return null;
        }
      })
    );

    if (!shouldContinueProcessing()) {
      console.log('Processamento pausado durante o lote');
      return;
    }

    // Filtra apenas os novos doramas válidos
    const newDoramas = batchResults
      .filter((series): series is Series => {
        if (!series) return false;
        return isKoreanDrama(series);
      });

    // Adiciona os novos doramas ao final da lista
    processedDoramas = [...processedDoramas, ...newDoramas];
    processingState.lastProcessedIndex = i + BATCH_SIZE;

    // Notifica a UI com todos os doramas processados até agora
    if (onUpdate && !signal?.aborted && shouldContinueProcessing()) {
      onUpdate(processedDoramas, seriesIds.length);
    }
  }

  if (shouldContinueProcessing()) {
    console.log(`Processamento concluído. Total de doramas: ${processedDoramas.length}`);
    processingState.isProcessing = false;
  }
}; 