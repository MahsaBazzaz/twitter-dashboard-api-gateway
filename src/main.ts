import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice({
    transport: Transport.NATS,
  });
  await app.startAllMicroservicesAsync();
  app.enableCors();
  await app.listen(3000);

}
bootstrap();
