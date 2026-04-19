import { observabilityConfig } from "@/lib/observability/config";

export type ObservabilitySignalType = "log" | "metric";

type ObservabilityEvent = {
  signalType: ObservabilitySignalType;
  name: string;
  level?: "debug" | "info" | "warn" | "error";
  message?: string;
  value?: number;
  unit?: string;
  attributes?: Record<string, unknown>;
  timestamp?: string;
};

function sendEvent(event: ObservabilityEvent): void {
  if (!observabilityConfig.enabled) {
    return;
  }

  const payload = JSON.stringify({
    ...event,
    service: observabilityConfig.serviceName,
    env: observabilityConfig.environment,
    timestamp: event.timestamp ?? new Date().toISOString()
  });

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(observabilityConfig.eventsEndpoint, blob);
    return;
  }

  void fetch(observabilityConfig.eventsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: payload,
    keepalive: true
  });
}

export const appLogger = {
  debug: (message: string, attributes?: Record<string, unknown>) =>
    sendEvent({ signalType: "log", level: "debug", name: "app.log", message, attributes }),
  info: (message: string, attributes?: Record<string, unknown>) =>
    sendEvent({ signalType: "log", level: "info", name: "app.log", message, attributes }),
  warn: (message: string, attributes?: Record<string, unknown>) =>
    sendEvent({ signalType: "log", level: "warn", name: "app.log", message, attributes }),
  error: (message: string, attributes?: Record<string, unknown>) =>
    sendEvent({ signalType: "log", level: "error", name: "app.log", message, attributes }),
  metric: (
    name: string,
    value: number,
    unit = "count",
    attributes?: Record<string, unknown>
  ) =>
    sendEvent({
      signalType: "metric",
      name,
      value,
      unit,
      attributes
    })
};
