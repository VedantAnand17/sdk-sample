export class Transactions {
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
        const path = `/api/transactions${query ? `?${query}` : ''}`;
        const raw = await this.client.get(path, opts);
        const hasMore = raw.hasMore ?? false;
        const data = Array.from(raw);
        return { data, hasMore };
    }
    async create(input, opts) {
        return this.client.post('/api/transactions', input, opts);
    }
}
