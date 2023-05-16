import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4300', 'http://localhost:4200'],
    credentials: true,
  })
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));

  await app.listen(5000);
}

void bootstrap();
