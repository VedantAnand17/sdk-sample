import { NextResponse } from "next/server";
import { bag } from "@/lib/bag";

export async function GET() {
  try {
    const { data } = await bag.transactions.list();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
