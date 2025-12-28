import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mini Trello')
    .setDescription('Mini Trello API description')
    .setVersion('1.0')
    .addTag('Mini Trello')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
