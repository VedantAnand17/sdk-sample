"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagError = exports.Bag = void 0;
const client_js_1 = require("./client");
const payment_links_js_1 = require("./resources/payment-links");
const transactions_js_1 = require("./resources/transactions");
const checkout_js_1 = require("./resources/checkout");
class Bag {
    client;
    paymentLinks;
    transactions;
    checkout;
    constructor(config) {
        this.client = new client_js_1.BagClient(config);
        this.paymentLinks = new payment_links_js_1.PaymentLinks(this.client);
        this.transactions = new transactions_js_1.Transactions(this.client);
        this.checkout = new checkout_js_1.Checkout(this.client);
    }
}
exports.Bag = Bag;
var client_js_2 = require("./client");
Object.defineProperty(exports, "BagError", { enumerable: true, get: function () { return client_js_2.BagError; } });
