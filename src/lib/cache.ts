import { DevelopmentPlan } from '../types/assessment';

const CACHE_PREFIX = 'ai_coach_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export function getCachedPlan(assessmentId: string): DevelopmentPlan | null {
  try {
    const cacheKey = `${CACHE_PREFIX}${assessmentId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    const entry: CacheEntry<DevelopmentPlan> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.data;
  } catch (err) {
    console.error('Cache read error:', err);
    return null;
  }
}

export function cachePlan(assessmentId: string, plan: DevelopmentPlan): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${assessmentId}`;
    const entry: CacheEntry<DevelopmentPlan> = {
      data: plan,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

export function clearPlanCache(assessmentId: string): void {
  try {
    const cacheKey = `${CACHE_PREFIX}${assessmentId}`;
    localStorage.removeItem(cacheKey);
  } catch (err) {
    console.error('Cache clear error:', err);
  }
}

export function clearAllPlanCaches(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (err) {
    console.error('Cache clear all error:', err);
  }
}