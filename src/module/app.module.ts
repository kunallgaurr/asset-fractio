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
import { SettingsAndPreferencesModule } from './settings-and-preferences';
import { AuthenticationMiddleware } from 'src/helpers/middleware';

@Module({
  imports: [
    ConnectionModule,
    GlobalModule,
    EventEmitterModule.forRoot({ global: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    JwtModule.register({
      global: true,
      secret: 'your-super-secret-jwt-key-change-in-production',
      signOptions: { expiresIn: '5d' }
    }),
    UserModule,
    CommunicationModule,
    SettingsAndPreferencesModule
  ],
  controllers: [],
  providers: [RateLimiter],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(RateLimiter).forRoutes('*');
    consumer.apply(AuthenticationMiddleware)
      .exclude(
        '/user/signup',
        '/user/signin'
      ).forRoutes('*');
  }
}
