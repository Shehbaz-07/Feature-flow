// Simple in-memory cache for API routes
export class CacheService {
  private static cache = new Map<string, { value: any; expiry: number }>();

  static set(key: string, value: any, ttlSeconds: number = 60) {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  static get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  static invalidate(key: string) {
    this.cache.delete(key);
  }
  
  static clear() {
    this.cache.clear();
  }
}
