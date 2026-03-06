export class BagError extends Error {
    statusCode;
    code;
    constructor(statusCode, message, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = 'BagError';
    }
}
export class BagClient {
    apiKey;
    baseUrl;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = (config.baseUrl ?? 'https://justusebag.xyz').replace(/\/$/, '');
    }
    async request(method, path, body) {
        const url = `${this.baseUrl}${path}`;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
        const res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });
        let json;
        try {
            json = await res.json();
        }
        catch {
            throw new BagError(res.status, `Unexpected response format (status ${res.status})`);
        }
        if (!res.ok || json.status === 'error') {
            throw new BagError(res.status, json.message ?? `Request failed with status ${res.status}`, json.code);
        }
        return json.data;
    }
    get(path) {
        return this.request('GET', path);
    }
    post(path, body) {
        return this.request('POST', path, body);
    }
    patch(path, body) {
        return this.request('PATCH', path, body);
    }
    delete(path, body) {
        return this.request('DELETE', path, body);
    }
}
