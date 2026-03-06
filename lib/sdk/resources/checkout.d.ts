import type { BagClient } from '../client.js';
import type { CheckoutSession, CheckoutSessionStatus, CheckoutSubmitResult, CreateCheckoutSessionInput, TaxQuoteInput, TaxQuoteResult, RequestOptions } from '../types.js';
export declare class Checkout {
    private client;
    constructor(client: BagClient);
    createSession(input: CreateCheckoutSessionInput, opts?: RequestOptions): Promise<CheckoutSession>;
    getSession(id: string, opts?: RequestOptions): Promise<CheckoutSessionStatus>;
    submit(sessionId: string, txHash: string, opts?: RequestOptions): Promise<CheckoutSubmitResult>;
    getTaxQuote(input: TaxQuoteInput, opts?: RequestOptions): Promise<TaxQuoteResult>;
}
