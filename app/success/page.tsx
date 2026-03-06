"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-2">Payment successful!</h1>
        <p className="text-muted mb-8">
          Thank you for your purchase. Your plan is now active and ready to use.
        </p>

        <div className="p-4 bg-card border border-card-border rounded-xl mb-8 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Payment confirmed</p>
              <p className="text-xs text-muted">Paid via USDC on Bag checkout</p>
            </div>
          </div>
          <p className="text-xs text-muted">
            A receipt has been sent to your email. You can also view the invoice on the Bag checkout page.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="/"
            className="flex-1 py-3 bg-card border border-card-border rounded-xl text-sm font-medium hover:bg-card-border/50 transition-colors text-center"
          >
            Back to store
          </a>
          <a
            href="/dashboard"
            className="flex-1 py-3 bg-accent hover:bg-accent-hover text-white rounded-xl text-sm font-medium transition-colors text-center"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
