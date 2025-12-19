import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api/v1');

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('ReFlow API')
        .setDescription('The ReFlow API description')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);

    app.use(
        '/v1/api/docs',
        apiReference({
            spec: {
                content: document,
            },
        }),
    );

    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
