import { NextResponse } from "next/server";

export async function POST() {
  try {
    const baseUrl = process.env.AI_SERVER_URL || "http://127.0.0.1:8001";
    const res = await fetch(`${baseUrl}/start-session`, { method: "POST" });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "AI server not reachable", details: e?.message || String(e) },
      { status: 502 }
    );
  }
}


