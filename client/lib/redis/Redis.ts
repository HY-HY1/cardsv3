import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL as string;

if (!REDIS_URL) {
  throw new Error('REDIS_URL Not found in .env.local');
}

let redis: Redis;

if (!(global as any).redis) {
  (global as any).redis = new Redis(REDIS_URL);
}

redis = (global as any).redis;

export default redis;
