import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { UserModule } from './user.module';
import { ResponseInterceptor } from './common/response.interceptor';
import { CatchEverythingFilter } from './common/errorHandler.middleware';
import { AuthGuard, RolesGuard } from './middlewares/auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.useGlobalGuards(new AuthGuard(), new RolesGuard(new Reflector()));
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new CatchEverythingFilter(httpAdapterHost));
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
