import { NextRequest, NextResponse } from "next/server";
import { bag } from "@/lib/bag";

const BAG_CHECKOUT_URL = process.env.BAG_BASE_URL || "https://justusebag.xyz";

export async function POST(request: NextRequest) {
  try {
    const { name, amount, description, returnPath } = await request.json();

    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "";
    const isLocalDev = origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1");

    const createInput: Record<string, unknown> = {
      name,
      amount,
      description,
      network: "base_sepolia",
    };

    // targetUrl only works with HTTPS in production.
    // In local dev, the Bag checkout page won't have a "Return to Merchant" button,
    // but the redirect flow still works — the user just navigates back manually.
    if (!isLocalDev && returnPath) {
      createInput.targetUrl = `${origin}${returnPath}`;
    }

    const link = await bag.paymentLinks.create(createInput as Parameters<typeof bag.paymentLinks.create>[0]);
    const checkoutUrl = `${BAG_CHECKOUT_URL}/pay/${link.id}`;

    return NextResponse.json({ checkoutUrl, linkId: link.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
