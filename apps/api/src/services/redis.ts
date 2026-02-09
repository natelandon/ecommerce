import { createClient } from 'redis';
import { logger } from '../lib/logger';

export type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;

/**
 * Initialize Redis client connection
 * Returns null if connection fails (non-blocking)
 */
export async function initRedis(): Promise<RedisClient | null> {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);

  redisClient = createClient({
    socket: {
      host,
      port,
      reconnectStrategy: () => {
        // Disable automatic reconnection - Redis is optional
        return new Error('Redis connection disabled');
      },
      // Timeout connection attempt after 2 seconds
      connectTimeout: 2000,
    },
  });

  // Set up error handler before attempting connection
  let hasError = false;
  redisClient.on('error', (err) => {
    hasError = true;
    logger.debug(
      'Redis connection error (expected if Redis not running)',
      err.message,
    );
  });

  redisClient.on('connect', () => {
    logger.info('Redis: Connected');
  });

  redisClient.on('ready', () => {
    logger.info('Redis: Ready');
  });

  try {
    // Attempt connection with timeout
    const connectPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), 3000),
    );

    await Promise.race([connectPromise, timeoutPromise]);

    if (hasError) {
      logger.warn('Redis: Connection failed - proceeding without cache');
      // Close the failed client
      redisClient.removeAllListeners();
      redisClient = null;
      return null;
    }

    return redisClient;
  } catch (error) {
    logger.warn(
      'Redis: Connection failed - proceeding without cache',
      error instanceof Error ? error.message : String(error),
    );
    // Clean up failed client
    if (redisClient) {
      redisClient.removeAllListeners();
      try {
        await redisClient.quit().catch(() => {}); // Suppress quit errors
      } catch {}
    }
    redisClient = null;
    return null;
  }
}

/**
 * Get the Redis client instance
 */
export function getRedisClient(): RedisClient | null {
  return redisClient;
}

/**
 * Close Redis connection
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis: Connection closed');
  }
}

/**
 * Cache helper with automatic JSON serialization
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redisClient) return null;

  try {
    const cached = await redisClient.get(key);
    if (!cached) return null;

    return JSON.parse(cached) as T;
  } catch (error) {
    logger.error(`Redis: Error getting key ${key}`, error);
    return null;
  }
}

/**
 * Set cache with automatic JSON serialization and TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds?: number,
): Promise<boolean> {
  if (!redisClient) return false;

  try {
    const serialized = JSON.stringify(value);
    const ttl = ttlSeconds || parseInt(process.env.CACHE_TTL || '3600', 10);

    await redisClient.setEx(key, ttl, serialized);
    return true;
  } catch (error) {
    logger.error(`Redis: Error setting key ${key}`, error);
    return false;
  }
}

/**
 * Delete cache entry
 */
export async function deleteCache(key: string): Promise<boolean> {
  if (!redisClient) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis: Error deleting key ${key}`, error);
    return false;
  }
}

/**
 * Clear all cache entries matching a pattern
 */
export async function clearCachePattern(pattern: string): Promise<number> {
  if (!redisClient) return 0;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length === 0) return 0;

    await redisClient.del(keys);
    return keys.length;
  } catch (error) {
    logger.error(`Redis: Error clearing pattern ${pattern}`, error);
    return 0;
  }
}
