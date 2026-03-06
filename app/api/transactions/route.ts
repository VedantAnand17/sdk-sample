import { NextResponse } from "next/server";
import { bag } from "@/lib/bag";

export async function GET() {
  try {
    const transactions = await bag.transactions.list();
    return NextResponse.json(transactions);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
