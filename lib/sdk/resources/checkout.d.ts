import type { BagClient } from '../client.js';
import type { CheckoutSession, CheckoutSessionStatus, CheckoutSubmitResult, CreateCheckoutSessionInput, TaxQuoteInput, TaxQuoteResult } from '../types.js';
export declare class Checkout {
    private client;
    constructor(client: BagClient);
    createSession(input: CreateCheckoutSessionInput): Promise<CheckoutSession>;
    getSession(id: string): Promise<CheckoutSessionStatus>;
    submit(sessionId: string, txHash: string): Promise<CheckoutSubmitResult>;
    getTaxQuote(input: TaxQuoteInput): Promise<TaxQuoteResult>;
}
