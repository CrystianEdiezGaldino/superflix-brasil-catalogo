
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_DURATION = 5 * 60 * 1000; // 5 minutos
  private cleanupInterval: number | undefined;

  private constructor() {
    this.cache = new Map();
    
    // Configurar limpeza automática do cache a cada minuto
    this.cleanupInterval = window.setInterval(() => {
      this.cleanExpiredEntries();
    }, 60 * 1000);
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public set<T>(key: string, data: T, duration: number = this.DEFAULT_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + duration
    });
    console.log(`[Cache] Set: ${key}, expires in ${duration/1000}s. Cache size: ${this.cache.size}`);
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`[Cache] Miss: ${key}`);
      return null;
    }

    if (Date.now() > entry.timestamp) {
      console.log(`[Cache] Expired: ${key}`);
      this.cache.delete(key);
      return null;
    }

    console.log(`[Cache] Hit: ${key}, expires in ${(entry.timestamp - Date.now())/1000}s`);
    return entry.data as T;
  }

  public clear(): void {
    this.cache.clear();
    console.log('[Cache] Cleared all cache entries');
  }

  public remove(key: string): void {
    this.cache.delete(key);
    console.log(`[Cache] Removed: ${key}`);
  }

  private cleanExpiredEntries(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    this.cache.forEach((entry, key) => {
      if (now > entry.timestamp) {
        this.cache.delete(key);
        expiredCount++;
      }
    });
    
    if (expiredCount > 0) {
      console.log(`[Cache] Auto-cleanup: removed ${expiredCount} expired entries. Current size: ${this.cache.size}`);
    }
  }

  // Método para verificar o tamanho do cache
  public getCacheSize(): number {
    return this.cache.size;
  }
  
  // Método para destruir a instância e parar a limpeza automática
  public destroy(): void {
    if (this.cleanupInterval) {
      window.clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }
}

export const cacheManager = CacheManager.getInstance();
