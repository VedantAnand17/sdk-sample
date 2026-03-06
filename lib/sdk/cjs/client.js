"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BagClient = exports.BagError = void 0;
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_MAX_RETRIES = 2;
class BagError extends Error {
    statusCode;
    code;
    requestId;
    constructor(statusCode, message, code, requestId) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.requestId = requestId;
        this.name = 'BagError';
    }
}
exports.BagError = BagError;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function retryDelay(attempt) {
    const base = Math.min(500 * 2 ** attempt, 8_000);
    const jitter = base * 0.25 * Math.random();
    return base + jitter;
}
class BagClient {
    apiKey;
    baseUrl;
    timeout;
    maxRetries;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = (config.baseUrl ?? 'https://justusebag.xyz').replace(/\/$/, '');
        this.timeout = config.timeout ?? DEFAULT_TIMEOUT_MS;
        this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    }
    async request(method, path, body, opts) {
        const url = `${this.baseUrl}${path}`;
        const timeoutMs = opts?.timeout ?? this.timeout;
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };
        if (opts?.idempotencyKey) {
            headers['Idempotency-Key'] = opts.idempotencyKey;
        }
        let lastError;
        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            if (attempt > 0) {
                await sleep(retryDelay(attempt - 1));
            }
            const controller = new AbortController();
            const externalSignal = opts?.signal;
            if (externalSignal?.aborted) {
                throw new BagError(0, 'Request aborted');
            }
            const onAbort = () => controller.abort();
            externalSignal?.addEventListener('abort', onAbort, { once: true });
            const timer = setTimeout(() => controller.abort(), timeoutMs);
            try {
                const res = await fetch(url, {
                    method,
                    headers,
                    body: body ? JSON.stringify(body) : undefined,
                    signal: controller.signal,
                });
                clearTimeout(timer);
                externalSignal?.removeEventListener('abort', onAbort);
                const requestId = res.headers.get('x-request-id') ?? undefined;
                let json;
                try {
                    json = await res.json();
                }
                catch {
                    throw new BagError(res.status, `Unexpected response format (status ${res.status})`, undefined, requestId);
                }
                if (!res.ok || json.status === 'error') {
                    const err = new BagError(res.status, json.message ?? `Request failed with status ${res.status}`, json.code, requestId);
                    if (RETRYABLE_STATUS_CODES.has(res.status) && attempt < this.maxRetries) {
                        lastError = err;
                        continue;
                    }
                    throw err;
                }
                const result = (json.data ?? {});
                result._metadata = { statusCode: res.status, requestId };
                if (json.hasMore !== undefined) {
                    result.hasMore = json.hasMore;
                }
                return result;
            }
            catch (err) {
                clearTimeout(timer);
                externalSignal?.removeEventListener('abort', onAbort);
                if (err instanceof BagError) {
                    throw err;
                }
                const isAbort = err instanceof DOMException && err.name === 'AbortError';
                if (isAbort && externalSignal?.aborted) {
                    throw new BagError(0, 'Request aborted');
                }
                if (isAbort) {
                    throw new BagError(0, `Request timed out after ${timeoutMs}ms`);
                }
                const networkErr = new BagError(0, err.message ?? 'Network error');
                if (attempt < this.maxRetries) {
                    lastError = networkErr;
                    continue;
                }
                throw networkErr;
            }
        }
        throw lastError ?? new BagError(0, 'Request failed after retries');
    }
    get(path, opts) {
        return this.request('GET', path, undefined, opts);
    }
    post(path, body, opts) {
        return this.request('POST', path, body, opts);
    }
    patch(path, body, opts) {
        return this.request('PATCH', path, body, opts);
    }
    delete(path, body, opts) {
        return this.request('DELETE', path, body, opts);
    }
}
exports.BagClient = BagClient;
