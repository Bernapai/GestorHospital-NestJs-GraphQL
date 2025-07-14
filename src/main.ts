import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  //Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Mi API de Salud')
    .setDescription('Documentación de usuarios, médicos y citas')
    .setVersion('1.0')
    .addTag('usuarios')
    .addTag('medicos')
    .addTag('citas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  //Pipes for Dtos Configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // lanza error si mandan propiedades extra
      transform: true,            // transforma payloads a clases DTO automáticamente
    }),
  );

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);

}
bootstrap();
