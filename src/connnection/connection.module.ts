import { Global, Module } from '@nestjs/common';
import { RedisModule } from './redis';
import { PostgresModule } from './postgres';

@Global()
@Module({
  imports: [PostgresModule, RedisModule],
  controllers: [],
  providers: [],
})
export class ConnectionModule {}
