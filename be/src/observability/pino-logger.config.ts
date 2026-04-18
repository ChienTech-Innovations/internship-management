import { context, trace } from '@opentelemetry/api';
import { randomUUID } from 'crypto';
import { Params } from 'nestjs-pino';

function getTraceFields() {
  const span = trace.getSpan(context.active());
  if (!span) {
    return {};
  }

  const spanContext = span.spanContext();
  return {
    trace_id: spanContext.traceId,
    span_id: spanContext.spanId,
  };
}

export const pinoLoggerConfig: Params = {
  pinoHttp: {
    level: process.env.LOG_LEVEL ?? 'info',
    base: {
      service: process.env.OTEL_SERVICE_NAME ?? 'internship-management-be',
      env: process.env.NODE_ENV ?? 'development',
    },
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    formatters: {
      level: (label) => ({ level: label }),
    },
    genReqId: (req, res) => {
      const headerRequestId = req.headers['x-request-id'];
      const requestId =
        typeof headerRequestId === 'string' && headerRequestId.trim() !== ''
          ? headerRequestId
          : randomUUID();

      res.setHeader('x-request-id', requestId);
      return requestId;
    },
    customSuccessObject: () => ({
      ...getTraceFields(),
    }),
    customErrorObject: () => ({
      ...getTraceFields(),
    }),
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers["x-api-key"]',
        'req.body.password',
        'req.body.currentPassword',
        'req.body.newPassword',
        'req.body.token',
        'req.body.accessToken',
        'req.body.refreshToken',
      ],
      censor: '[REDACTED]',
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        remote_address: req.remoteAddress,
        remote_port: req.remotePort,
      }),
      res: (res) => ({
        status_code: res.statusCode,
      }),
    },
    autoLogging: {
      ignore: (req) => req.url === '/metrics',
    },
  },
};
