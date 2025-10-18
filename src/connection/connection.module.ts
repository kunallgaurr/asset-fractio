import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis';
import { PostgresModule } from './postgres';

@Global()
@Module({
  imports: [PostgresModule, RedisModule],
  exports: [RedisModule]
})
export class ConnectionModule { }
