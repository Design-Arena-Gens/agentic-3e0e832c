import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/lib/types";
import { superEnsemble } from "@/lib/providers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages?: ChatMessage[] };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const answer = await superEnsemble(messages);
    return NextResponse.json({ answer });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
