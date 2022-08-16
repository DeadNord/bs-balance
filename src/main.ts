import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import helmet from 'helmet';
import * as compression from 'compression';
const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('BS-Balance API')
    .setDescription('The BeSocial Studio API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs/swagger', app, document);

  app.use(helmet());
  app.use(compression());

  await app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}
bootstrap();
