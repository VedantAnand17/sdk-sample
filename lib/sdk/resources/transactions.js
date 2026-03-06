export class Transactions {
    client;
    constructor(client) {
        this.client = client;
    }
    async list() {
        return this.client.get('/api/transactions');
    }
    async create(input) {
        return this.client.post('/api/transactions', input);
    }
}
