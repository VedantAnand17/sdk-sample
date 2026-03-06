import type { BagConfig, RequestOptions, ResponseMetadata } from './types.js';
export declare class BagError extends Error {
    statusCode: number;
    code?: string | undefined;
    requestId?: string | undefined;
    constructor(statusCode: number, message: string, code?: string | undefined, requestId?: string | undefined);
}
export declare class BagClient {
    private apiKey;
    private baseUrl;
    private timeout;
    private maxRetries;
    constructor(config: BagConfig);
    request<T>(method: string, path: string, body?: unknown, opts?: RequestOptions): Promise<T & {
        _metadata: ResponseMetadata;
    }>;
    get<T>(path: string, opts?: RequestOptions): Promise<T & {
        _metadata: ResponseMetadata;
    }>;
    post<T>(path: string, body: unknown, opts?: RequestOptions): Promise<T & {
        _metadata: ResponseMetadata;
    }>;
    patch<T>(path: string, body: unknown, opts?: RequestOptions): Promise<T & {
        _metadata: ResponseMetadata;
    }>;
    delete<T>(path: string, body?: unknown, opts?: RequestOptions): Promise<T & {
        _metadata: ResponseMetadata;
    }>;
}
