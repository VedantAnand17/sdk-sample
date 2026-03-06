import type { BagClient } from '../client.js';
import type { Transaction, CreateTransactionInput } from '../types.js';
export declare class Transactions {
    private client;
    constructor(client: BagClient);
    list(): Promise<Transaction[]>;
    create(input: CreateTransactionInput): Promise<Transaction>;
}
