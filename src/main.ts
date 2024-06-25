import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useBodyParser('text');
  app.useBodyParser('raw')
  app.use(bodyParser.text({limit: '50mb'})); 
  await app.listen(3000);
}
bootstrap();
