import type { BagConfig } from './types.js';
export declare class BagError extends Error {
    statusCode: number;
    code?: string | undefined;
    constructor(statusCode: number, message: string, code?: string | undefined);
}
export declare class BagClient {
    private apiKey;
    private baseUrl;
    constructor(config: BagConfig);
    request<T>(method: string, path: string, body?: unknown): Promise<T>;
    get<T>(path: string): Promise<T>;
    post<T>(path: string, body: unknown): Promise<T>;
    patch<T>(path: string, body: unknown): Promise<T>;
    delete<T>(path: string, body?: unknown): Promise<T>;
}
