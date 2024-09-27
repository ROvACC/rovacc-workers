import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const trainingWorkers =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URL],
        queue: process.env.RABBIT_MQ_TRAINING_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    });
  await trainingWorkers.listen();
}
bootstrap();
