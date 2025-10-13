import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConnectionModule } from 'src/connnection';

@Module({
  imports: [
    ConnectionModule, 
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: './.env'
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
