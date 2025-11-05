import { NextResponse } from "next/server";
import { getProvidersInfo } from "@/lib/providers";

export const runtime = "nodejs";

export async function GET() {
  const providers = getProvidersInfo().filter(p => p.id !== "super");
  return NextResponse.json({ providers });
}
