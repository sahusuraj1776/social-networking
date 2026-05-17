import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix('api')
  app.use('/media', express.static('uploads'));
  app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
})
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
