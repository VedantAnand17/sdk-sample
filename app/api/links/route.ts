import { NextRequest, NextResponse } from "next/server";
import { bag } from "@/lib/bag";

export async function GET() {
  try {
    const links = await bag.paymentLinks.list();
    return NextResponse.json(links);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const link = await bag.paymentLinks.create(body);
    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
