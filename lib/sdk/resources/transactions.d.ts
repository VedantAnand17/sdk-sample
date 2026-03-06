import type { BagClient } from '../client.js';
import type { Transaction, CreateTransactionInput, ListParams, PaginatedList, RequestOptions } from '../types.js';
export declare class Transactions {
    private client;
    constructor(client: BagClient);
    list(params?: ListParams, opts?: RequestOptions): Promise<PaginatedList<Transaction>>;
    create(input: CreateTransactionInput, opts?: RequestOptions): Promise<Transaction>;
}
