export const observabilityConfig = {
  enabled: process.env.NEXT_PUBLIC_OBSERVABILITY_ENABLED !== "false",
  serviceName:
    process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? "internship-management-fe",
  serviceVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  traceSampleRate: Number(process.env.NEXT_PUBLIC_TRACE_SAMPLE_RATE ?? "0.2"),
  eventsEndpoint: "/api/observability/events",
  tracesEndpoint: "/api/observability/traces"
};

export const serverObservabilityConfig = {
  tracesEndpoint:
    process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
    `${(process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? "http://localhost:4318").replace(/\/$/, "")}/v1/traces`
};
