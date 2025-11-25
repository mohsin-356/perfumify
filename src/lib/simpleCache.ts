type CacheEntry<T> = { value: T; expiry: number };

class SimpleCache {
  private store = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | undefined {
    const item = this.store.get(key);
    if (!item) return undefined;
    if (Date.now() > item.expiry) {
      this.store.delete(key);
      return undefined;
    }
    return item.value as T;
  }

  set<T>(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiry: Date.now() + ttlMs });
  }

  del(key: string): void {
    this.store.delete(key);
  }
}

export const simpleCache = new SimpleCache();
