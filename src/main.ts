import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as swaggerUi from 'swagger-ui-express';
import 'source-map-support/register'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();

  const swaggerDoc = yaml.load(fs.readFileSync(__dirname + '/../swagger/swagger.yml', 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc))

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
