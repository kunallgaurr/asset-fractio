import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { RedisService } from './redis.service';
import { constants } from 'src/utils';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: constants.PROVIDERS.REDIS_CONNECTION,
      useFactory: async (configService: ConfigService) => {
        try {
          const client = createClient({
            socket: {
              host: configService.get<string>('REDIS_HOST') as string,
              port: configService.get<number>('REDIS_PORT') as number,
              tls: true
            },
            username: configService.get<string>('REDIS_USERNAME'),
            password: configService.get<string>('REDIS_PASSWORD'),
          });

          client.on('error', (err) => console.error('Redis Client Error', err));

          console.log('Establishing connection to redis...')
          await client.connect();
          console.log('Connected to redis!')

          return client;
        } catch (error) {
          console.log('Connection failed with redis.')
        }
      },
      inject: [ConfigService],
    },
    RedisService
  ],
})
export class RedisModule { }
