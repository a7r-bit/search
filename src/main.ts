import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import NestjsLoggerServiceAdapter from './infrastructure/logger/infrastructure/winston/nestjs/nestjsLoggerServiceAdapter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true, logger: false });

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'fileprovider',
            protoPath: join(__dirname, 'modules', 'file-provider', 'protos', 'file-provider.proto'),
            url: '0.0.0.0:50051',
        },
    });
    await app.startAllMicroservices();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe({}));
    app.useLogger(app.get(NestjsLoggerServiceAdapter));

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle('Search API')
        .setDescription('Документация для API сервиса Search')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'access-token',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: '/docs-json' });

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
