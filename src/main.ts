import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe({}));

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

    app.use('/uploads', express.static('/app/uploads'));

    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
