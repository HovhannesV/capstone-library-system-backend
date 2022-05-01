import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from "@nestjs/common";
import 'source-map-support/register'
import {NotificationsModule} from "./notifications/notifications.module";


async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  app.use((req, res, next) => { res.status(404).send({message : "No http api available"}) })

  await app.listen(process.env.PORT || 8080);
}
bootstrap();