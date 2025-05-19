
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_DURATION = 5 * 60 * 1000; // 5 minutos
  private cleanupInterval: number | null = null;

  private constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
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
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public clear(): void {
    this.cache.clear();
  }

  public remove(key: string): void {
    this.cache.delete(key);
  }
  
  public getCacheSize(): number {
    return this.cache.size;
  }
  
  // Clean expired cache entries periodically to prevent memory leaks
  private startCleanupInterval(): void {
    // Run cleanup every 5 minutes
    this.cleanupInterval = window.setInterval(() => {
      this.cleanExpiredEntries();
    }, 5 * 60 * 1000);
  }
  
  private cleanExpiredEntries(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    // Identify expired entries
    this.cache.forEach((entry, key) => {
      if (now > entry.timestamp) {
        expiredKeys.push(key);
      }
    });
    
    // Remove expired entries
    expiredKeys.forEach(key => {
      this.cache.delete(key);
    });
    
    if (expiredKeys.length > 0 && import.meta.env.DEV) {
      console.log(`Cache cleanup: removed ${expiredKeys.length} expired entries`);
    }
  }
  
  public stopCleanupInterval(): void {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export const cacheManager = CacheManager.getInstance();
