import { NestFactory } from '@nestjs/core';
import { FollowModule } from './follow.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FollowModule,
    {
      transport:Transport.TCP,
      options:{port:4004}
    }
  );
  await app.listen();
}
bootstrap();
