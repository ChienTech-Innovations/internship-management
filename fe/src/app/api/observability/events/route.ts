import { NextRequest, NextResponse } from "next/server";

type EventPayload = {
  signalType: "log" | "metric";
  name: string;
  level?: "debug" | "info" | "warn" | "error";
  message?: string;
  value?: number;
  unit?: string;
  attributes?: Record<string, unknown>;
  timestamp?: string;
  service?: string;
  env?: string;
};

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as EventPayload;

    if (!payload?.signalType || !payload?.name) {
      return NextResponse.json(
        { ok: false, error: "signalType and name are required" },
        { status: 400 }
      );
    }

    const message =
      payload.signalType === "metric"
        ? "frontend metric"
        : payload.level
          ? `frontend log (${payload.level})`
          : "frontend log";

    // Structured stdout logs let fluent-bit/ELK parse FE telemetry without SDK lock-in.
    console.log(
      JSON.stringify({
        message,
        signalType: payload.signalType,
        name: payload.name,
        value: payload.value,
        unit: payload.unit,
        attributes: payload.attributes,
        env: payload.env ?? process.env.NODE_ENV ?? "development",
        service: payload.service ?? "internship-management-fe",
        timestamp: payload.timestamp ?? new Date().toISOString()
      })
    );

    return NextResponse.json({ ok: true }, { status: 202 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid payload" },
      { status: 400 }
    );
  }
}
