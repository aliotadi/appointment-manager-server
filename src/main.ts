import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig, swaggerOptions } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('/api-doc', app, document);

  await app.listen(process.env.PORT);
  console.log(`app is running on port ${process.env.PORT}`);
}
bootstrap();
