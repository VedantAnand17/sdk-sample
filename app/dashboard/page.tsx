"use client";

import { useState, useEffect, useCallback } from "react";
interface PaymentLink {
  id: string; name: string; amount: number; currency: string; network: string;
  token: string; active: boolean; targetUrl?: string; livemode: boolean;
  merchantWalletAddress: string; totalCollected: number; totalTransactions: number;
  createdAt: string; updatedAt: string;
}
interface Transaction {
  id: string; amount: number; token: string; network: string; status: string;
  customerEmail: string; customerName: string; txHash: string; createdAt: string;
}

const NETWORK_LABELS: Record<string, string> = {
  base: "Base", ethereum: "Ethereum", polygon: "Polygon", solana: "Solana",
  base_sepolia: "Base Sepolia", eth_sepolia: "Eth Sepolia", solana_devnet: "Solana Devnet",
};

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-[var(--success)]/15 text-[var(--success)]",
  pending: "bg-yellow-500/15 text-yellow-400",
  confirming: "bg-blue-500/15 text-blue-400",
  broadcasted: "bg-purple-500/15 text-purple-400",
  failed: "bg-[var(--danger)]/15 text-[var(--danger)]",
  refunded: "bg-[var(--muted)]/15 text-[var(--muted)]",
};

export default function Dashboard() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [linksRes, txRes] = await Promise.all([
      fetch("/api/links").then((r) => r.json()).catch(() => []),
      fetch("/api/transactions").then((r) => r.json()).catch(() => []),
    ]);
    setLinks(Array.isArray(linksRes) ? linksRes : []);
    setTransactions(Array.isArray(txRes) ? txRes : []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm">A</div>
            <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-[var(--muted)] text-sm">Merchant admin — view payment links and transactions</p>
        </div>
        <a href="/" className="px-4 py-2 text-sm border border-[var(--card-border)] rounded-lg hover:bg-[var(--card)] transition-colors">
          Back to store
        </a>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-[var(--card)] border border-[var(--card-border)] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-lg font-medium mb-4">
              Payment Links <span className="text-[var(--muted)] text-sm font-normal">({links.length})</span>
            </h2>
            {links.length === 0 ? (
              <p className="text-[var(--muted)] text-sm py-8 text-center">No payment links yet. Buy something from the store to create one.</p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div key={link.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">{link.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${link.active ? "bg-[var(--success)]/15 text-[var(--success)]" : "bg-[var(--muted)]/15 text-[var(--muted)]"}`}>
                          {link.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                        <span className="font-mono">${link.amount.toFixed(2)}</span>
                        <span>{NETWORK_LABELS[link.network] || link.network}</span>
                        {link.targetUrl && <span className="text-xs truncate max-w-[200px]">→ {link.targetUrl}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-medium mb-4">
              Transactions <span className="text-[var(--muted)] text-sm font-normal">({transactions.length})</span>
            </h2>
            {transactions.length === 0 ? (
              <p className="text-[var(--muted)] text-sm py-8 text-center">No transactions yet. Complete a payment to see it here.</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-[var(--card)] border border-[var(--card-border)] rounded-xl flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">${Number(tx.amount).toFixed(2)} {tx.token}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[tx.status] || "bg-[var(--muted)]/15 text-[var(--muted)]"}`}>
                          {tx.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--muted)]">
                        <span>{tx.customerName || tx.customerEmail || "—"}</span>
                        <span>{NETWORK_LABELS[tx.network] || tx.network}</span>
                        <span className="font-mono text-xs truncate max-w-[200px]">{tx.txHash}</span>
                      </div>
                    </div>
                    <div className="text-sm text-[var(--muted)] shrink-0">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
