import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const redisOptions: RedisModuleOptions = {
  config: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
  },
};
