import { PaymentLinks } from './resources/payment-links.js';
import { Transactions } from './resources/transactions.js';
import { Checkout } from './resources/checkout.js';
import type { BagConfig } from './types.js';
export declare class Bag {
    private client;
    paymentLinks: PaymentLinks;
    transactions: Transactions;
    checkout: Checkout;
    constructor(config: BagConfig);
}
export { BagError } from './client.js';
export type { BagConfig, PaymentLink, CreatePaymentLinkInput, UpdatePaymentLinkInput, Transaction, CreateTransactionInput, CheckoutSession, CheckoutSessionStatus, CheckoutSubmitResult, CreateCheckoutSessionInput, TaxQuoteInput, TaxQuoteResult, TransactionStatus, Network, ApiResponse, } from './types.js';
