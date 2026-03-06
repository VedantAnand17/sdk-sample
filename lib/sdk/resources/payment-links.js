export class PaymentLinks {
    client;
    constructor(client) {
        this.client = client;
    }
    async list() {
        return this.client.get('/api/payment-links');
    }
    async get(id) {
        return this.client.get(`/api/payment-links/${id}`);
    }
    async create(input) {
        return this.client.post('/api/payment-links', input);
    }
    async update(id, input) {
        return this.client.patch(`/api/payment-links/${id}`, input);
    }
    async delete(id) {
        await this.client.delete(`/api/payment-links/${id}`);
    }
}
