import { toast } from 'react-hot-toast';

interface RequestConfig extends Omit<RequestInit, 'cache'> {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
    useCache?: boolean;
    cacheTime?: number;
}

interface CacheEntry {
    data: any;
    timestamp: number;
}

class OptimizedApiClient {
    private baseURL: string;
    private cache: Map<string, CacheEntry> = new Map();
    private pendingRequests: Map<string, Promise<any>> = new Map();
    private abortControllers: Map<string, AbortController> = new Map();

    constructor(baseURL: string | undefined) {
        this.baseURL = baseURL || 'http://localhost:5000/api/v1';
    }

    /**
     * Make optimized API request with caching, retries, and deduplication
     */
    async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        const {
            timeout = 30000,
            retries = 3,
            retryDelay = 1000,
            useCache = false,
            cacheTime = 60000, // 1 minute
            ...fetchConfig
        } = config;

        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${config.method || 'GET'}:${endpoint}:${JSON.stringify(config.body || {})}`;

        // Check cache first
        if (useCache && (config.method === 'GET' || !config.method)) {
            const cached = this.getFromCache(cacheKey, cacheTime);
            if (cached) {
                return { success: true, data: cached };
            }
        }

        // Request deduplication - if same request is already in flight, return that promise
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey)!;
        }

        // Create abort controller
        const abortController = new AbortController();
        this.abortControllers.set(cacheKey, abortController);

        // Set timeout
        const timeoutId = setTimeout(() => abortController.abort(), timeout);

        const requestPromise = this.makeRequestWithRetry<T>(
            url,
            {
                ...fetchConfig,
                signal: abortController.signal,
            },
            retries,
            retryDelay
        )
            .then((result) => {
                // Cache successful GET requests
                if (useCache && (config.method === 'GET' || !config.method) && result.success) {
                    this.setCache(cacheKey, result.data);
                }
                return result;
            })
            .finally(() => {
                clearTimeout(timeoutId);
                this.pendingRequests.delete(cacheKey);
                this.abortControllers.delete(cacheKey);
            });

        this.pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
    }

    /**
     * Make request with exponential backoff retry
     */
    private async makeRequestWithRetry<T>(
        url: string,
        config: RequestInit,
        retriesLeft: number,
        retryDelay: number
    ): Promise<{ success: boolean; data?: T; error?: string }> {
        try {
            const response = await fetch(url, {
                ...config,
                headers: {
                    'Content-Type': 'application/json',
                    ...config.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error: any) {
            // Don't retry if aborted
            if (error.name === 'AbortError') {
                return { success: false, error: 'Request timeout' };
            }

            // Retry logic
            if (retriesLeft > 0) {
                await this.delay(retryDelay);
                return this.makeRequestWithRetry<T>(
                    url,
                    config,
                    retriesLeft - 1,
                    retryDelay * 2 // Exponential backoff
                );
            }

            return {
                success: false,
                error: error.message || 'Network request failed',
            };
        }
    }

    /**
     * Cancel a specific request
     */
    cancelRequest(endpoint: string, method: string = 'GET', body?: any) {
        const cacheKey = `${method}:${endpoint}:${JSON.stringify(body || {})}`;
        const controller = this.abortControllers.get(cacheKey);
        if (controller) {
            controller.abort();
            this.abortControllers.delete(cacheKey);
            this.pendingRequests.delete(cacheKey);
        }
    }

    /**
     * Cancel all pending requests
     */
    cancelAllRequests() {
        this.abortControllers.forEach((controller) => controller.abort());
        this.abortControllers.clear();
        this.pendingRequests.clear();
    }

    /**
     * Get from cache
     */
    private getFromCache(key: string, maxAge: number): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const age = Date.now() - entry.timestamp;
        if (age > maxAge) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set cache
     */
    private setCache(key: string, data: any) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });

        // Clean old cache entries (simple LRU)
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Delay helper
     */
    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

// Create singleton instance
const apiUrl = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : undefined;
export const optimizedApiClient = new OptimizedApiClient(
    apiUrl || 'http://localhost:5000/api/v1'
);

// Chatbot-specific methods with optimizations
export const optimizedChatbotApi = {
    /**
     * Ask question with deduplication and retry
     */
    async ask(data: {
        question: string;
        conversationHistory: any[];
        currentPage?: string;
        propertyId?: string;
    }) {
        return optimizedApiClient.request('/chatbot/ask', {
            method: 'POST',
            body: JSON.stringify(data),
            retries: 2,
            timeout: 15000,
        });
    },

    /**
     * Request agent handoff
     */
    async requestAgent(data: { conversationHistory: any[]; reason?: string }) {
        return optimizedApiClient.request('/chatbot/handoff', {
            method: 'POST',
            body: JSON.stringify(data),
            retries: 3,
            timeout: 10000,
        });
    },

    /**
     * Submit rating
     */
    async rate(data: {
        sessionId: string | null;
        rating: number;
        feedback?: string;
        type: 'ai' | 'agent';
    }) {
        return optimizedApiClient.request('/chatbot/rate', {
            method: 'POST',
            body: JSON.stringify(data),
            retries: 2,
        });
    },

    /**
     * Get conversation history with caching
     */
    async getHistory() {
        return optimizedApiClient.request('/chatbot/history', {
            method: 'GET',
            useCache: true,
            cacheTime: 30000, // Cache for 30 seconds
        });
    },

    /**
     * Get active session with caching
     */
    async getActiveSession() {
        return optimizedApiClient.request('/chatbot/session', {
            method: 'GET',
            useCache: true,
            cacheTime: 10000, // Cache for 10 seconds
        });
    },

    /**
     * Clear history
     */
    async clearHistory() {
        const result = await optimizedApiClient.request('/chatbot/history', {
            method: 'DELETE',
        });

        // Clear cache after clearing history
        optimizedApiClient.clearCache();

        return result;
    },

    /**
     * Cancel all chatbot requests
     */
    cancelAll() {
        optimizedApiClient.cancelAllRequests();
    },
};

/**
 * Debounced function helper
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };

        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttled function helper
 */
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;

    return function executedFunction(...args: Parameters<T>) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
