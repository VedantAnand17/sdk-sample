import { NextRequest, NextResponse } from "next/server";
import { bag } from "@/lib/bag";

export async function GET() {
  try {
    const { data } = await bag.paymentLinks.list();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, amount, network } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const numAmount = Number(amount);
    if (typeof amount === "undefined" || amount === null || Number.isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }
    if (!network || typeof network !== "string" || network.trim() === "") {
      return NextResponse.json({ error: "network is required" }, { status: 400 });
    }

    const link = await bag.paymentLinks.create({
      ...body,
      name: name.trim(),
      amount: numAmount,
      network: network.trim(),
    });
    return NextResponse.json(link, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
