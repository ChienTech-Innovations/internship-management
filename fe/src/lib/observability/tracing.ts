import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { BatchSpanProcessor, ParentBasedSampler, TraceIdRatioBasedSampler } from "@opentelemetry/sdk-trace-base";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  SEMRESATTRS_DEPLOYMENT_ENVIRONMENT,
  SEMRESATTRS_SERVICE_NAME,
  SEMRESATTRS_SERVICE_VERSION
} from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch";
import { observabilityConfig } from "@/lib/observability/config";

declare global {
  interface Window {
    __otelBrowserInitialized?: boolean;
  }
}

export function initBrowserTracing(): void {
  if (
    !observabilityConfig.enabled ||
    typeof window === "undefined" ||
    window.__otelBrowserInitialized
  ) {
    return;
  }

  const exporter = new OTLPTraceExporter({
    url: observabilityConfig.tracesEndpoint
  });

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      [SEMRESATTRS_SERVICE_NAME]: observabilityConfig.serviceName,
      [SEMRESATTRS_SERVICE_VERSION]: observabilityConfig.serviceVersion,
      [SEMRESATTRS_DEPLOYMENT_ENVIRONMENT]: observabilityConfig.environment
    }),
    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(observabilityConfig.traceSampleRate)
    }),
    spanProcessors: [new BatchSpanProcessor(exporter)]
  });

  provider.register();

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: /.*/,
        clearTimingResources: true
      })
    ]
  });

  window.__otelBrowserInitialized = true;
}
