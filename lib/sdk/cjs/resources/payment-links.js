"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentLinks = void 0;
class PaymentLinks {
    client;
    constructor(client) {
        this.client = client;
    }
    async list(params, opts) {
        const qs = new URLSearchParams();
        if (params?.limit)
            qs.set('limit', String(params.limit));
        if (params?.starting_after)
            qs.set('starting_after', params.starting_after);
        const query = qs.toString();
        const path = `/api/payment-links${query ? `?${query}` : ''}`;
        const raw = await this.client.get(path, opts);
        const hasMore = raw.hasMore ?? false;
        const data = Array.from(raw);
        return { data, hasMore };
    }
    async get(id, opts) {
        return this.client.get(`/api/payment-links/${id}`, opts);
    }
    async create(input, opts) {
        return this.client.post('/api/payment-links', input, opts);
    }
    async update(id, input, opts) {
        return this.client.patch(`/api/payment-links/${id}`, input, opts);
    }
    async delete(id, opts) {
        await this.client.delete(`/api/payment-links/${id}`, undefined, opts);
    }
}
exports.PaymentLinks = PaymentLinks;
