import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { json } from 'body-parser';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { AppClusterService } from './app_cluster.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);
  app.enableShutdownHooks();
  // app.setGlobalPrefix(configService.get('app.apiPrefix'), {
  //   exclude: ['/'],
  // });
  app.use(json({ limit: '25mb' }));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  let options = null;

  if (process.env.NODE_ENV !== 'production') {
    options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .setBasePath('/api')
      .addBearerAuth()
      .build();
  } else {
    options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API docs')
      .setVersion('1.0')
      .setBasePath('/api')
      .addBearerAuth()
      .addServer('/api')
      .build();
  }

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://example.com',
      'http://example.com',
      'http://example.com',
      'http://example.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(configService.get('app.port'));
  console.log('Started at: ', configService.get('app.port'));
}

if (process.env.NODE_ENV === 'production') {
  AppClusterService.clusterize(bootstrap);
} else {
  void bootstrap();
}
