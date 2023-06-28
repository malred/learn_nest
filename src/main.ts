import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    // {
    //   // 选择显示哪些日志级别
    //   logger: ['error', 'warn', 'debug']
    // }
  );
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
