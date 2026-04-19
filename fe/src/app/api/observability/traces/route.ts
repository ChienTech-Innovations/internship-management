import { NextRequest, NextResponse } from "next/server";
import { serverObservabilityConfig } from "@/lib/observability/config";

export async function POST(request: NextRequest) {
  try {
    const contentType =
      request.headers.get("content-type") ?? "application/x-protobuf";
    const body = await request.arrayBuffer();

    const collectorResponse = await fetch(serverObservabilityConfig.tracesEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": contentType
      },
      body
    });

    if (!collectorResponse.ok) {
      return NextResponse.json(
        { ok: false, error: "failed to forward traces" },
        { status: 502 }
      );
    }

    return new NextResponse(null, { status: 202 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "failed to process traces" },
      { status: 500 }
    );
  }
}
