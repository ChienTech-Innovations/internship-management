"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useReportWebVitals } from "next/web-vitals";
import { appLogger } from "@/lib/observability/logger";
import { initBrowserTracing } from "@/lib/observability/tracing";

type ObservabilityProviderProps = {
  children: React.ReactNode;
};

export default function ObservabilityProvider({
  children
}: ObservabilityProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    initBrowserTracing();
  }, []);

  useEffect(() => {
    appLogger.info("route_change", { pathname });
  }, [pathname]);

  useEffect(() => {
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      appLogger.error("unhandled_promise_rejection", {
        reason:
          event.reason instanceof Error
            ? event.reason.message
            : String(event.reason)
      });
    };
    const onUnhandledError = (event: ErrorEvent) => {
      appLogger.error("uncaught_error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onUnhandledError);
    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onUnhandledError);
    };
  }, []);

  useReportWebVitals((metric) => {
    appLogger.metric(`web_vitals.${metric.name.toLowerCase()}`, metric.value, metric.name, {
      id: metric.id,
      navigationType: metric.navigationType
    });
  });

  return <>{children}</>;
}
