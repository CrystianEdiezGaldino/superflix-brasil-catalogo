
interface CachedItem<T> {
  value: T;
  expires: number | null;
}

class CacheManager {
  private cache: Map<string, CachedItem<any>> = new Map();

  /**
   * Store a value in the cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttlMs - Time to live in milliseconds (optional)
   */
  set<T>(key: string, value: T, ttlMs?: number): void {
    const expires = ttlMs ? Date.now() + ttlMs : null;
    this.cache.set(key, { value, expires });
  }

  /**
   * Get a value from the cache
   * @param key - Cache key
   * @returns The cached value or undefined if expired or not found
   */
  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    // Check if item has expired
    if (item.expires && item.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }

  /**
   * Remove a specific item from the cache
   * @param key - Cache key to remove
   */
  remove(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached items
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clear expired items from the cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expires && item.expires < now) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Create and export a singleton instance
export const cacheManager = new CacheManager();

// Set up automatic clearing of expired items every minute
setInterval(() => {
  cacheManager.clearExpired();
}, 60000);
