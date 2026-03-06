import type { BagClient } from '../client.js';
import type { PaymentLink, CreatePaymentLinkInput, UpdatePaymentLinkInput, ListParams, PaginatedList, RequestOptions } from '../types.js';
export declare class PaymentLinks {
    private client;
    constructor(client: BagClient);
    list(params?: ListParams, opts?: RequestOptions): Promise<PaginatedList<PaymentLink>>;
    get(id: string, opts?: RequestOptions): Promise<PaymentLink>;
    create(input: CreatePaymentLinkInput, opts?: RequestOptions): Promise<PaymentLink>;
    update(id: string, input: UpdatePaymentLinkInput, opts?: RequestOptions): Promise<PaymentLink>;
    delete(id: string, opts?: RequestOptions): Promise<void>;
}
