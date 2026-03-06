# Bag SDK Sample

A sample Next.js storefront demonstrating how to integrate [Bag](https://justusebag.xyz) — the Merchant of Record for stablecoin payments — using the `@tbagtapp/sdk` TypeScript SDK.

## What this shows

- **Storefront** — A pricing page with three products. Click "Buy" to create a payment link via the SDK and redirect to Bag's hosted checkout.
- **Success page** — Post-payment confirmation screen.
- **Dashboard** — Lists all payment links and transactions created through the SDK.
- **API routes** — Server-side usage of `bag.paymentLinks` and `bag.transactions` methods.

## Quick start

```bash
# 1. Clone the repo
git clone https://github.com/getbagsapp/sdk-sample.git
cd sdk-sample

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Bag test API key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the storefront.

## Environment variables

| Variable | Description |
| --- | --- |
| `BAG_API_KEY` | Your Bag API key (`bag_test_sk_*` for sandbox) |
| `BAG_BASE_URL` | API base URL (defaults to `https://justusebag.xyz`) |

Get your test API key from the [Bag dashboard](https://justusebag.xyz) → Developer Settings.

## Project structure

```
sdk-sample/
├── app/
│   ├── page.tsx              # Storefront with pricing cards
│   ├── success/page.tsx      # Post-payment success page
│   ├── dashboard/page.tsx    # Payment links & transactions viewer
│   └── api/
│       ├── checkout/route.ts     # Creates payment link → redirects to Bag checkout
│       ├── links/route.ts        # List/create payment links via SDK
│       ├── links/[id]/route.ts   # Update/delete a payment link
│       └── transactions/route.ts # List transactions via SDK
├── lib/
│   ├── bag.ts                # SDK client initialization
│   └── sdk/                  # SDK type definitions
├── browser-test.mjs          # Playwright test for the storefront flow
├── storefront-test.mjs       # Playwright test for checkout redirect flow
└── test-screenshots/         # Generated test screenshots
```

## How the checkout flow works

1. Customer clicks **Buy** on a product card
2. Your API route calls `bag.paymentLinks.create()` to create a payment link
3. Customer is redirected to `https://justusebag.xyz/pay/{linkId}` (Bag's hosted checkout)
4. Customer pays with USDC on the selected network
5. Customer returns to your `/success` page
6. Bag sends a webhook to your server confirming the payment

## Running browser tests

The repo includes Playwright-based browser tests:

```bash
# Install Playwright
npx playwright install chromium

# Start the dev server first
npm run dev

# Run the tests
node browser-test.mjs
node storefront-test.mjs
```

Screenshots are saved to `test-screenshots/`.

## Tech stack

- [Next.js](https://nextjs.org) 16
- [Tailwind CSS](https://tailwindcss.com) 4
- [@tbagtapp/sdk](https://www.npmjs.com/package/@tbagtapp/sdk) — Bag TypeScript SDK

## Learn more

- [Bag Documentation](https://docs.justusebag.xyz)
- [Quickstart Guide](https://docs.justusebag.xyz/docs/getting-started/quickstart)
- [TypeScript SDK Reference](https://docs.justusebag.xyz/docs/sdks/typescript)
- [API Reference](https://docs.justusebag.xyz/docs/api-reference)
