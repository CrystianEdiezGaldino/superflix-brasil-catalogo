interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private readonly DEFAULT_EXPIRATION = 1000 * 60 * 10; // 10 minutes
  private readonly MAX_CACHE_SIZE = 100; // Maximum number of items in cache

  private constructor() {
    this.cache = new Map();
    this.startCleanupInterval();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set<T>(key: string, data: T, expiresIn: number = this.DEFAULT_EXPIRATION): void {
    // Check if cache is full and remove oldest item if necessary
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.getOldestKey();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn
    });
  }

  public get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // Check if item has expired
    if (Date.now() - item.timestamp > item.expiresIn) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  private getOldestKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private startCleanupInterval(): void {
    // Clean up expired items every minute
    setInterval(() => {
      const now = Date.now();
      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > item.expiresIn) {
          this.cache.delete(key);
        }
      }
    }, 60000);
  }
}

// Session management
export const sessionManager = {
  setRedirectFlag: () => {
    sessionStorage.setItem('auth_redirect_shown', 'true');
  },

  hasRedirectFlag: () => {
    return sessionStorage.getItem('auth_redirect_shown') === 'true';
  },

  clearRedirectFlag: () => {
    sessionStorage.removeItem('auth_redirect_shown');
  },

  setLastPath: (path: string) => {
    sessionStorage.setItem('last_path', path);
  },

  getLastPath: () => {
    return sessionStorage.getItem('last_path') || '/';
  },

  clearLastPath: () => {
    sessionStorage.removeItem('last_path');
  }
};

export const cacheService = CacheService.getInstance(); 