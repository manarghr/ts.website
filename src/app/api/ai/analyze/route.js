import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const baseUrl = process.env.AI_SERVER_URL || "http://127.0.0.1:8001";
    const body = await request.json();

    const res = await fetch(`${baseUrl}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      console.error(`AI backend error (${res.status}):`, errorText);
      return NextResponse.json(
        { ok: false, error: `AI server error (${res.status})`, details: errorText },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("AI server connection error:", e);
    return NextResponse.json(
      { ok: false, error: "AI server not reachable", details: e?.message || String(e) },
      { status: 502 }
    );
  }
}


