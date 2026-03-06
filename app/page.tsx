"use client";

import { useState } from "react";

// SDK types inlined to avoid symlink resolution issues with Turbopack
// In production, import directly: import type { PaymentLink } from "@tbagtapp/sdk"

const PRODUCTS = [
  {
    id: "pro",
    name: "Pro Plan",
    description: "Everything you need to grow. Unlimited projects, priority support, and advanced analytics.",
    amount: 29.99,
    badge: "Popular",
    features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom domains", "API access"],
  },
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for getting started. All the essentials for individuals and small teams.",
    amount: 9.99,
    badge: null,
    features: ["5 projects", "Email support", "Basic analytics", "1 custom domain"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams that need everything. Dedicated support, SLA, and custom integrations.",
    amount: 199.00,
    badge: "Best Value",
    features: ["Unlimited everything", "Dedicated account manager", "99.99% SLA", "Custom integrations", "SSO & SAML", "Audit logs"],
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-card-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <span className="font-semibold tracking-tight">Acme Inc</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted">
            <a href="#" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="/dashboard" className="px-4 py-1.5 bg-card border border-card-border rounded-lg hover:bg-card-border/50 text-foreground transition-colors">
              Dashboard
            </a>
          </div>
        </div>
      </nav>

      <header className="pt-20 pb-16 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
          Powered by Bag — pay with USDC
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 max-w-2xl mx-auto leading-tight">
          Ship faster with<br />the right plan
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto">
          Choose a plan and pay instantly with USDC. Checkout is handled by Bag — like Stripe, but for stablecoins.
        </p>
      </header>

      <section id="pricing" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted mb-3">How the checkout flow works:</p>
          <div className="inline-flex items-center gap-3 text-xs text-muted">
            <Step n={1} label="Click Buy" />
            <Arrow />
            <Step n={2} label="SDK creates payment link" />
            <Arrow />
            <Step n={3} label="Redirect to Bag checkout" />
            <Arrow />
            <Step n={4} label="Pay with USDC" />
            <Arrow />
            <Step n={5} label="Return to your site" />
          </div>
        </div>
      </section>

      <footer className="border-t border-card-border py-8 text-center text-xs text-muted">
        Sample storefront built with{" "}
        <code className="font-mono text-foreground/70 bg-card px-1.5 py-0.5 rounded">
          @tbagtapp/sdk
        </code>
        {" "}— demonstrating the Stripe-like redirect checkout flow
      </footer>
    </div>
  );
}

function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  const [loading, setLoading] = useState(false);
  const isPopular = product.badge === "Popular";

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.name,
          amount: product.amount,
          description: product.description,
          returnPath: "/success",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to create checkout");
        return;
      }

      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`relative p-6 rounded-2xl border transition-all ${
        isPopular
          ? "bg-accent/5 border-accent/30 shadow-lg shadow-accent/5"
          : "bg-card border-card-border hover:border-card-border/80"
      }`}
    >
      {product.badge && (
        <span
          className={`absolute -top-2.5 left-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${
            isPopular
              ? "bg-accent text-white"
              : "bg-card-border text-foreground"
          }`}
        >
          {product.badge}
        </span>
      )}

      <div className="mb-6 pt-2">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-muted leading-relaxed">{product.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-3xl font-bold">${product.amount}</span>
        <span className="text-muted text-sm ml-1">/ month</span>
      </div>

      <ul className="space-y-2.5 mb-8">
        {product.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={handleBuy}
        disabled={loading}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
          isPopular
            ? "bg-accent hover:bg-accent-hover text-white shadow-md shadow-accent/20"
            : "bg-foreground/10 hover:bg-foreground/15 text-foreground"
        }`}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Redirecting to checkout...
          </span>
        ) : (
          `Buy for $${product.amount}`
        )}
      </button>
    </div>
  );
}

function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-5 h-5 rounded-full bg-card border border-card-border flex items-center justify-center text-[10px] font-bold">
        {n}
      </span>
      <span>{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4 text-card-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
