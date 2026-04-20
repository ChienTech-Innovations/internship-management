function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * URLs matched here get W3C trace headers on fetch. Only cross-origin calls that
 * match need this (CORS); scope to your API (not a catch-all regex) so trace
 * headers are not injected into third-party fetches.
 *
 * Optional env NEXT_PUBLIC_OTEL_PROPAGATE_TRACE_CORS_REGEX: full regex string if
 * the default derived from NEXT_PUBLIC_API_BASE_URL is not enough (multiple API hosts).
 */
export function getFetchTracePropagationUrlRegex(): RegExp {
  const custom = process.env.NEXT_PUBLIC_OTEL_PROPAGATE_TRACE_CORS_REGEX?.trim();
  if (custom) {
    return new RegExp(custom);
  }
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
  ).replace(/\/$/, "");
  return new RegExp(`^${escapeRegExp(base)}`);
}

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
