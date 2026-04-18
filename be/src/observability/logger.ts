import { context, trace } from '@opentelemetry/api';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

const enrichWithTraceContext = format((info) => {
  const span = trace.getSpan(context.active());
  if (span) {
    const spanContext = span.spanContext();
    info.trace_id = spanContext.traceId;
    info.span_id = spanContext.spanId;
  }

  return info;
});

export function createAppLogger() {
  return WinstonModule.createLogger({
    level: process.env.LOG_LEVEL ?? 'info',
    format: format.combine(
      format.timestamp(),
      enrichWithTraceContext(),
      format.errors({ stack: true }),
      format.json(),
    ),
    transports: [new transports.Console()],
  });
}
