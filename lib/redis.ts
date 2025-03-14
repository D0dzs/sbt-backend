import Redis from "ioredis";

// https://docs.railway.com/reference/errors/enotfound-redis-railway-internal
const redisClient = new Redis(`${process.env.REDIS_URL!}?family=0`, {
  connectTimeout: 10000,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

export default redisClient;
