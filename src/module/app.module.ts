import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConnectionModule } from '../connection';
import { UserModule } from './user';
import { CommunicationModule } from './communication';
import { JwtModule } from '@nestjs/jwt';
import { GlobalModule } from 'src/global/global.module';
import { LoggerMiddleware } from 'src/helpers/middleware/logger.middleware';
import { RateLimiter } from 'src/helpers/middleware/rate-limiter.middleware';

@Module({
  imports: [
    ConnectionModule, 
    GlobalModule,
    UserModule,
    CommunicationModule,
    EventEmitterModule.forRoot({global: true}),
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: './.env'
    }),
    JwtModule.register({
      global: true,
      secret: 'your-super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: '5d' }
    })
  ],
  controllers: [],
  providers: [RateLimiter],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(RateLimiter).forRoutes('*');
  }
}
