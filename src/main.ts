import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { ZodValidationPipe } from './helpers/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT ?? 3000
  await app.listen(port);

  process.on('uncaughtException', () => {
    console.log('Shutting down due to an uncaughtException')
    process.exit(1);
  })

  process.on('unhandledRejection', (error) => {
    console.log('Shutting down due to an unhandledRejection');
    process.exit(1);
  })

  console.log('Server is running on port ' + port)
}
bootstrap();
