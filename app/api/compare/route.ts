import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/lib/types";
import { allProviders, fallbackProvider } from "@/lib/providers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { providerIds, messages } = (await req.json()) as { providerIds?: string[]; messages?: ChatMessage[] };
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages required" }, { status: 400 });
    }
    const ids = (providerIds && providerIds.length > 0) ? providerIds : allProviders.map(p => p.id);
    const selected = allProviders.filter(p => ids.includes(p.id));
    const tasks = selected.map(async (p) => {
      try {
        if (!p.isEnabled()) throw new Error("disabled");
        const text = await p.complete(messages);
        return [p.id, text] as const;
      } catch {
        const text = await fallbackProvider.complete(messages);
        return [p.id, text] as const;
      }
    });
    const settled = await Promise.all(tasks);
    const results: Record<string, string> = Object.fromEntries(settled);
    return NextResponse.json({ results });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
