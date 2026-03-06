export interface BagConfig {
    apiKey: string;
    baseUrl?: string;
    timeout?: number;
    maxRetries?: number;
}
export interface RequestOptions {
    idempotencyKey?: string;
    timeout?: number;
    signal?: AbortSignal;
}
export type TransactionStatus = 'broadcasted' | 'pending' | 'confirming' | 'completed' | 'failed' | 'refunded';
export type Network = 'base' | 'ethereum' | 'polygon' | 'solana' | 'base_sepolia' | 'eth_sepolia' | 'solana_devnet';
export type CheckoutSessionState = 'payment_session_created' | 'txn_broadcast' | 'txn_confirming' | 'txn_finalized' | 'complete' | 'failed' | 'expired' | 'manual_retry_needed';
export interface ListParams {
    limit?: number;
    starting_after?: string;
}
export interface PaginatedList<T> {
    data: T[];
    hasMore: boolean;
}
export interface PaymentLink {
    id: string;
    name: string;
    description?: string;
    amount: number;
    currency: string;
    network: string;
    networks?: string[];
    token: string;
    active: boolean;
    merchantWalletAddress: string;
    merchantName?: string;
    totalCollected: number;
    totalTransactions: number;
    livemode: boolean;
    targetUrl?: string;
    createdAt: string;
    updatedAt: string;
}
export interface CreatePaymentLinkInput {
    name: string;
    description?: string;
    amount: number;
    currency?: string;
    network: Network;
    networks?: Network[];
    token?: string;
    merchantWalletAddress?: string;
    merchantWalletAddresses?: Record<string, string>;
    targetUrl?: string;
}
export interface UpdatePaymentLinkInput {
    active?: boolean;
    name?: string;
    description?: string;
    amount?: number;
    currency?: string;
    network?: string;
    token?: string;
}
export interface Transaction {
    id: string;
    amount: number;
    token: string;
    network: string;
    status: TransactionStatus;
    customerEmail: string;
    customerName: string;
    txHash: string;
    walletAddress: string;
    merchantWalletAddress: string;
    subtotalAmount?: number;
    taxAmount?: number;
    customerCountry?: string;
    createdAt: string;
}
export interface CreateTransactionInput {
    amount: number;
    token: string;
    network: Network;
    txHash: string;
    walletAddress: string;
    customerEmail?: string;
    customerName?: string;
    customerAddress?: string;
    paymentLinkId?: string;
}
export interface CheckoutSession {
    sessionId: string;
    status: CheckoutSessionState;
    quote: {
        subtotalCents: number;
        taxCents: number;
        totalCents: number;
        calculationId: string;
    };
    expiresAt: string;
}
export interface CheckoutSessionStatus {
    sessionId: string;
    status: CheckoutSessionState;
    txHash?: string;
    confirmations?: number;
    blockNumber?: string;
    chainMeta?: {
        network: string;
        walletType: string;
    };
    errors?: {
        code: string;
        message: string;
    };
    actions: string[];
    events: Array<{
        status: string;
        source: string;
        createdAt: string;
    }>;
    expiresAt: string;
}
export interface CheckoutSubmitResult {
    status: string;
    txHash: string;
    sessionId: string;
    nextAction: string;
}
export interface CreateCheckoutSessionInput {
    linkId: string;
    quoteToken: string;
    walletAddress: string;
    walletType: 'evm' | 'solana';
    network: Network;
    customer: {
        name: string;
        email: string;
        address: string;
        country: string;
    };
    totalsSnapshot: {
        subtotalCents: number;
        taxCents: number;
        totalCents: number;
        calculationId: string;
    };
}
export interface TaxQuoteInput {
    paymentLinkId: string;
    customerAddress: {
        address_line_1: string;
        address_city: string;
        address_province?: string;
        address_postal_code?: string;
        address_country: string;
        address_type?: string;
    };
}
export interface TaxQuoteResult {
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    calculationId: string;
    quoteToken: string;
}
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    hasMore?: boolean;
    message?: string;
    code?: string;
    hint?: string;
}
export interface ResponseMetadata {
    statusCode: number;
    requestId?: string;
}
