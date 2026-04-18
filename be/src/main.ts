import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerSetupConfig } from './configs/swagger.config';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { CORS_CONFIG } from './configs/cors.config';
import { Request, Response } from 'express';
import { createAppLogger } from './observability/logger';
import {
  getPrometheusContentType,
  getPrometheusMetrics,
  observeHttpRequestMetrics,
} from './observability/metrics';
import { bootstrapTracing, shutdownTracing } from './observability/tracing';

async function bootstrap() {
  await bootstrapTracing();

  const app = await NestFactory.create(AppModule, {
    logger: createAppLogger(),
  });
  const port = process.env.PORT || 3000;

  // Bật Socket.IO adapter để WebSocket gateway dùng Socket.IO (realtime notifications)
  app.useWebSocketAdapter(new IoAdapter(app));
  app.use(observeHttpRequestMetrics);

  const httpServer = app.getHttpAdapter().getInstance();
  httpServer.get('/metrics', async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', getPrometheusContentType());
    res.send(await getPrometheusMetrics());
  });

  SwaggerSetupConfig(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.enableCors(CORS_CONFIG);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

void bootstrap();

process.on('SIGTERM', async () => {
  await shutdownTracing();
});

process.on('SIGINT', async () => {
  await shutdownTracing();
});
