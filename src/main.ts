import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { SuccessRequestInterceptor } from './shared/interceptors/success-request.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      ignoreGlobalPrefix: false,
    },
  };

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ validateCustomDecorators: true, transform: true }));
  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));
  // app.useGlobalGuards(new RequiredPermissionsGuard(new Reflector()));
  app.useGlobalInterceptors(new SuccessRequestInterceptor());

  const config = new DocumentBuilder().setTitle('ECycleable').setDescription('The API description').addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token').addSecurityRequirements('access-token').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, customOptions);
  // app.use(cookieParser());

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  
  await app.listen(8000);
}
bootstrap();
