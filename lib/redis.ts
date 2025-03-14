import Redis from "ioredis";

const redisClient = new Redis(process.env.REDIS_PUBLIC_URL!);

export default redisClient;
