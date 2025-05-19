
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private readonly DEFAULT_DURATION = 5 * 60 * 1000; // 5 minutos

  private constructor() {
    this.cache = new Map();
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
}

export const cacheManager = CacheManager.getInstance();
