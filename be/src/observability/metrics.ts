import { NextFunction, Request, Response } from 'express';
import client, { Histogram, Registry } from 'prom-client';

const METRICS_PREFIX = 'internship_management_';

const registry = new Registry();
client.collectDefaultMetrics({
  prefix: METRICS_PREFIX,
  register: registry,
});

const httpRequestDurationSeconds = new Histogram({
  name: `${METRICS_PREFIX}http_request_duration_seconds`,
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 1, 2, 5],
  registers: [registry],
});

export function observeHttpRequestMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationInSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path ?? req.path;

    httpRequestDurationSeconds.observe(
      {
        method: req.method,
        route,
        status_code: String(res.statusCode),
      },
      durationInSeconds,
    );
  });

  next();
}

export async function getPrometheusMetrics(): Promise<string> {
  return registry.metrics();
}

export function getPrometheusContentType(): string {
  return registry.contentType;
}
