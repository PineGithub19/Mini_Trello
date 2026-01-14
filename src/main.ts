import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import { LoggerInterceptor } from './common/interceptors/logger.interceptor';
import { LogstashService } from './logstash/logstash.service';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // cookie
  });

  const config = new DocumentBuilder()
    .setTitle('Mini Trello')
    .setDescription('Mini Trello API description')
    .setVersion('1.0')
    .addTag('Mini Trello')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'minitrello-consumer',
      },
    },
  });
  await app.startAllMicroservices();

  app.setGlobalPrefix('api');
  const logstashService = app.get(LogstashService);
  app.useGlobalInterceptors(new LoggerInterceptor(logstashService), new ResponseTransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
