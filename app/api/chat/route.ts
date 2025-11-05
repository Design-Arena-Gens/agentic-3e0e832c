import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/lib/types";
import { safeComplete } from "@/lib/providers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { providerId, messages } = (await req.json()) as { providerId?: string; messages?: ChatMessage[] };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const id = providerId || "openai";
    const response = await safeComplete(id, messages);
    return NextResponse.json({ answer: response });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
