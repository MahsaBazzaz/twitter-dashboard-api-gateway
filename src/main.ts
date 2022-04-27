import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';


async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();


// async function bootstrap() {
//   //we have a hybrid app here!
//   const app = await NestFactory.create(AppModule);
//   const microservice = app.connectMicroservice({
//     transport: Transport.NATS,
//   });
//   app.enableCors();
//   let port = 3000;
//   await app.listen(port);
// }
// bootstrap();