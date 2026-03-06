import { BagClient } from './client.js';
import { PaymentLinks } from './resources/payment-links.js';
import { Transactions } from './resources/transactions.js';
import { Checkout } from './resources/checkout.js';
export class Bag {
    client;
    paymentLinks;
    transactions;
    checkout;
    constructor(config) {
        this.client = new BagClient(config);
        this.paymentLinks = new PaymentLinks(this.client);
        this.transactions = new Transactions(this.client);
        this.checkout = new Checkout(this.client);
    }
}
export { BagError } from './client.js';
