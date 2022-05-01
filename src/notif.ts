import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from "@nestjs/common";
import 'source-map-support/register'
import {NotificationsModule} from "./notifications/notifications.module";


async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  await app.init()
}
bootstrap();