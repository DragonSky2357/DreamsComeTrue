import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발')
    .setVersion('1.0')
    .addTag('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispost(() => app.close());
  }
}
bootstrap();
