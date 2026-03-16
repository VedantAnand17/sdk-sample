import { NextRequest, NextResponse } from "next/server";
import { bag } from "@/lib/bag";
import type { CreatePaymentLinkInput } from "@tbagtapp/sdk";

const BAG_CHECKOUT_URL = process.env.BAG_BASE_URL || "https://getbags.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, amount, description, returnPath } = body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }
    const numAmount = Number(amount);
    if (typeof amount === "undefined" || amount === null || Number.isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "amount must be a positive number" }, { status: 400 });
    }

    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "";
    const isLocalDev = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");

    const createInput: CreatePaymentLinkInput = {
      name: name.trim(),
      amount: numAmount,
      description,
      network: "base_sepolia",
    };

    if (!isLocalDev && returnPath) {
      createInput.targetUrl = `${origin}${returnPath}`;
    }

    const link = await bag.paymentLinks.create(createInput);
    const checkoutUrl = `${BAG_CHECKOUT_URL}/pay/${link.id}`;

    return NextResponse.json({ checkoutUrl, linkId: link.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
