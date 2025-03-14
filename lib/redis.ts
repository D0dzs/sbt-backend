import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_URL!, {
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export default redisClient;
