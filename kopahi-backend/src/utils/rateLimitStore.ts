/*
 * Picks the rate-limit backing store.
 *
 * - When REDIS_URL is set, returns a `rate-limit-redis` store so multiple
 *   replicas share a single bucket per IP. Required for any deploy with
 *   more than one backend container.
 * - Otherwise returns undefined and express-rate-limit defaults to its
 *   in-process MemoryStore — fine for single-process dev and single-replica
 *   prod (DEPLOYMENT.md §8a explains the tradeoff).
 *
 * Returning the bare store lets each route define its own window / max
 * separately; only the storage backend is shared.
 */

import type { Store } from "express-rate-limit";
import logger from "./logger";

// Lazy singleton — ioredis only loaded when REDIS_URL is set, so dev
// installs don't need the redis daemon running.
type RedisLike = { call: (...args: string[]) => Promise<unknown> };
let redisClient: RedisLike | null = null;
let redisInitTried = false;

const getRedisClient = (): RedisLike | null => {
  if (redisInitTried) return redisClient;
  redisInitTried = true;
  if (!process.env.REDIS_URL) return null;
  try {
    // require so CJS resolution is happy and we don't need top-level await.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Redis } = require("ioredis");
    const client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
    });
    client.on("error", (err: Error) =>
      logger.error("redis_error", { err: err.message })
    );
    redisClient = client;
    logger.info("rate_limit_store", { backend: "redis" });
    return redisClient;
  } catch (err) {
    logger.warn("redis_init_failed", {
      err: (err as Error).message,
      fallback: "memory",
    });
    return null;
  }
};

/**
 * Returns a `rate-limit-redis` store if REDIS_URL is set and the client
 * connects, otherwise undefined (the express-rate-limit default
 * MemoryStore is used).
 */
export const buildLimiterStore = (prefix: string): Store | undefined => {
  const client = getRedisClient();
  if (!client) return undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const RedisStore = require("rate-limit-redis").default;
    return new RedisStore({
      sendCommand: (...args: string[]) => client.call(...args),
      prefix: `kopahi-rl:${prefix}:`,
    }) as Store;
  } catch (err) {
    logger.warn("rate_limit_redis_store_failed", {
      err: (err as Error).message,
      fallback: "memory",
    });
    return undefined;
  }
};

export default buildLimiterStore;
