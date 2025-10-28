import { Global, Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';

@Global()
@Module({
  imports: [],
  exports: [...redisProvider],
  providers: [...redisProvider],
})
export class RedisModule { }
