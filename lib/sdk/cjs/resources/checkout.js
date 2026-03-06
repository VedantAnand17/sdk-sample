"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checkout = void 0;
class Checkout {
    client;
    constructor(client) {
        this.client = client;
    }
    async createSession(input, opts) {
        return this.client.post('/api/checkout/session', input, opts);
    }
    async getSession(id, opts) {
        return this.client.get(`/api/checkout/session/${id}`, opts);
    }
    async submit(sessionId, txHash, opts) {
        return this.client.post('/api/checkout/submit', { sessionId, txHash }, opts);
    }
    async getTaxQuote(input, opts) {
        return this.client.post('/api/tax/quote', input, opts);
    }
}
exports.Checkout = Checkout;
