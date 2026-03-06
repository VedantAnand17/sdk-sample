export class Checkout {
    client;
    constructor(client) {
        this.client = client;
    }
    async createSession(input) {
        return this.client.post('/api/checkout/session', input);
    }
    async getSession(id) {
        return this.client.get(`/api/checkout/session/${id}`);
    }
    async submit(sessionId, txHash) {
        return this.client.post('/api/checkout/submit', { sessionId, txHash });
    }
    async getTaxQuote(input) {
        return this.client.post('/api/tax/quote', input);
    }
}
