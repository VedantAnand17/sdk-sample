import type { BagClient } from '../client.js';
import type { PaymentLink, CreatePaymentLinkInput, UpdatePaymentLinkInput } from '../types.js';
export declare class PaymentLinks {
    private client;
    constructor(client: BagClient);
    list(): Promise<PaymentLink[]>;
    get(id: string): Promise<PaymentLink>;
    create(input: CreatePaymentLinkInput): Promise<PaymentLink>;
    update(id: string, input: UpdatePaymentLinkInput): Promise<PaymentLink>;
    delete(id: string): Promise<void>;
}
