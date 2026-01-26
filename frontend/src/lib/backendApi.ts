// Backend API integration utilities
import { CONFIG } from '@/config';

const API_BASE_URL = CONFIG.API.FULL_URL;

/**
 * Get authentication token for backend API requests
 * Uses localStorage to retrieve the JWT token from backend authentication
 */
async function getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null;

    try {
        // Get token from localStorage (set during backend login)
        const token = localStorage.getItem('auth_token');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
}

/**
 * Make authenticated API call to backend
 */
async function backendApiCall(endpoint: string, options: RequestInit = {}) {
    const token = await getAuthToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    return await response.json();
}

/**
 * Backend API endpoints for property workflow
 */
export const backendApi = {
    // Authentication endpoints
    auth: {
        register: async (data: {
            email: string;
            password: string;
            displayName: string;
            role?: string;
        }) => {
            return backendApiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        login: async (email: string, password: string) => {
            return backendApiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
        },

        verifyToken: async (token: string) => {
            return backendApiCall('/auth/verify-token', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });
        },

        refreshToken: async (refreshToken: string) => {
            return backendApiCall('/auth/refresh-token', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            });
        },

        logout: async () => {
            return backendApiCall('/auth/logout', {
                method: 'POST',
            });
        },

        forgotPassword: async (email: string) => {
            return backendApiCall('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
        },
    },

    // User endpoints
    user: {
        getProfile: async () => {
            return backendApiCall('/users/profile');
        },

        updateProfile: async (updates: {
            displayName?: string;
            photoURL?: string;
            phoneNumber?: string;
            bio?: string;
            location?: string;
        }) => {
            return backendApiCall('/users/profile', {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },

        uploadAvatar: async (file: File) => {
            const formData = new FormData();
            formData.append('avatar', file);

            const token = await getAuthToken();
            const response = await fetch(`${API_BASE_URL}/users/avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            return await response.json();
        },

        getStats: async () => {
            return backendApiCall('/users/stats');
        },

        updatePreferences: async (preferences: {
            emailNotifications?: boolean;
            smsNotifications?: boolean;
            pushNotifications?: boolean;
        }) => {
            return backendApiCall('/users/preferences', {
                method: 'PUT',
                body: JSON.stringify(preferences),
            });
        },
    },

    // Property endpoints
    properties: {
        create: async (propertyData: any) => {
            return backendApiCall('/properties', {
                method: 'POST',
                body: JSON.stringify(propertyData),
            });
        },

        search: async (filters: any = {}) => {
            const params = new URLSearchParams(filters).toString();
            return backendApiCall(`/properties/search?${params}`);
        },

        getById: async (id: string) => {
            return backendApiCall(`/properties/${id}`);
        },

        getUserProperties: async (userId: string) => {
            return backendApiCall(`/properties/user/${userId}`);
        },

        createInquiry: async (propertyId: string, message: string) => {
            return backendApiCall(`/properties/${propertyId}/inquiry`, {
                method: 'POST',
                body: JSON.stringify({ message }),
            });
        },

        getAnalytics: async (propertyId: string) => {
            return backendApiCall(`/properties/${propertyId}/analytics`);
        },

        getSimilar: async (propertyId: string, limit: number = 5) => {
            return backendApiCall(`/properties/${propertyId}/similar?limit=${limit}`);
        },

        getTrending: async (limit: number = 10) => {
            return backendApiCall(`/properties/trending?limit=${limit}`);
        },

        trackView: async (propertyId: string) => {
            return backendApiCall(`/properties/${propertyId}/view`, {
                method: 'POST',
            });
        },

        update: async (propertyId: string, updates: any) => {
            return backendApiCall(`/properties/${propertyId}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
        },

        delete: async (propertyId: string) => {
            return backendApiCall(`/properties/${propertyId}`, {
                method: 'DELETE',
            });
        },
    },

    // Admin endpoints
    admin: {
        getAllProperties: async () => {
            return backendApiCall('/admin/properties');
        },

        approveProperty: async (propertyId: string) => {
            return backendApiCall(`/admin/properties/${propertyId}/approve`, {
                method: 'PUT',
            });
        },

        rejectProperty: async (propertyId: string, reason: string) => {
            return backendApiCall(`/admin/properties/${propertyId}/reject`, {
                method: 'PUT',
                body: JSON.stringify({ reason }),
            });
        },

        getAllUsers: async () => {
            return backendApiCall('/admin/users');
        },

        getAnalytics: async () => {
            return backendApiCall('/admin/analytics');
        },
    },

    // Notifications
    notifications: {
        getAll: async (options?: { unreadOnly?: boolean; limit?: number; after?: string }) => {
            const params = new URLSearchParams();
            if (options?.unreadOnly) params.append('unreadOnly', 'true');
            if (options?.limit) params.append('limit', options.limit.toString());
            if (options?.after) params.append('after', options.after);
            return backendApiCall(`/notifications?${params.toString()}`);
        },

        markAsRead: async (notificationId: string) => {
            return backendApiCall(`/notifications/${notificationId}/read`, {
                method: 'PUT',
            });
        },

        markAllAsRead: async () => {
            return backendApiCall('/notifications/mark-all-read', {
                method: 'PUT',
            });
        },

        create: async (notification: {
            type: string;
            title: string;
            message: string;
            link?: string;
            metadata?: any;
        }) => {
            return backendApiCall('/notifications', {
                method: 'POST',
                body: JSON.stringify(notification),
            });
        },

        delete: async (notificationId: string) => {
            return backendApiCall(`/notifications/${notificationId}`, {
                method: 'DELETE',
            });
        },
    },

    // Chat endpoints
    chat: {
        createConversation: async (data: {
            otherUserId: string;
            type: string;
            propertyId?: string;
        }) => {
            return backendApiCall('/chat/conversations', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getConversations: async () => {
            return backendApiCall('/chat/conversations');
        },

        getMessages: async (conversationId: string, limit = 50) => {
            return backendApiCall(`/chat/conversations/${conversationId}/messages?limit=${limit}`);
        },

        sendMessage: async (conversationId: string, content: string) => {
            return backendApiCall(`/chat/conversations/${conversationId}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content }),
            });
        },

        deleteConversation: async (conversationId: string) => {
            return backendApiCall(`/chat/conversations/${conversationId}`, {
                method: 'DELETE',
            });
        },

        uploadFile: async (
            file: File,
            conversationId: string,
            onProgress?: (progress: number) => void
        ) => {
            const token = await getAuthToken();
            const formData = new FormData();
            formData.append('file', file);
            formData.append('conversationId', conversationId);

            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                // Track upload progress
                xhr.upload.addEventListener('progress', (e) => {
                    if (e.lengthComputable && onProgress) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (error) {
                            reject(new Error('Invalid response'));
                        }
                    } else {
                        reject(new Error(`Upload failed: ${xhr.statusText}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload cancelled'));
                });

                xhr.open('POST', `${API_BASE_URL}/chat/upload`);
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                }
                xhr.send(formData);
            });
        },

        editMessage: async (messageId: string, content: string) => {
            return backendApiCall(`/chat/messages/${messageId}`, {
                method: 'PUT',
                body: JSON.stringify({ content }),
            });
        },

        deleteMessage: async (messageId: string) => {
            return backendApiCall(`/chat/messages/${messageId}`, {
                method: 'DELETE',
            });
        },
    },

    // Bids endpoints
    bids: {
        create: async (propertyId: string, amount: number, message?: string) => {
            return backendApiCall('/bids', {
                method: 'POST',
                body: JSON.stringify({ propertyId, amount, message }),
            });
        },

        accept: async (bidId: string) => {
            return backendApiCall(`/bids/${bidId}/accept`, {
                method: 'POST',
            });
        },

        reject: async (bidId: string, reason?: string) => {
            return backendApiCall(`/bids/${bidId}/reject`, {
                method: 'POST',
                body: JSON.stringify({ reason }),
            });
        },

        counter: async (bidId: string, amount: number, message?: string) => {
            return backendApiCall(`/bids/${bidId}/counter`, {
                method: 'POST',
                body: JSON.stringify({ amount, message }),
            });
        },

        acceptCounter: async (bidId: string) => {
            return backendApiCall(`/bids/${bidId}/accept-counter`, {
                method: 'POST',
            });
        },

        withdraw: async (bidId: string) => {
            return backendApiCall(`/bids/${bidId}/withdraw`, {
                method: 'POST',
            });
        },

        getPropertyBids: async (propertyId: string) => {
            return backendApiCall(`/bids/property/${propertyId}`);
        },

        getMyBids: async () => {
            return backendApiCall('/bids/my-bids');
        },
    },

    // Reviews endpoints
    reviews: {
        create: async (propertyId: string, rating: number, comment: string) => {
            return backendApiCall('/reviews', {
                method: 'POST',
                body: JSON.stringify({ propertyId, rating, comment }),
            });
        },

        getPropertyReviews: async (propertyId: string) => {
            return backendApiCall(`/reviews/property/${propertyId}`);
        },

        markHelpful: async (reviewId: string) => {
            return backendApiCall(`/reviews/${reviewId}/helpful`, {
                method: 'POST',
            });
        },

        report: async (reviewId: string, reason: string) => {
            return backendApiCall(`/reviews/${reviewId}/report`, {
                method: 'POST',
                body: JSON.stringify({ reason }),
            });
        },

        getMyReviews: async () => {
            return backendApiCall('/reviews/my-reviews');
        },
    },

    // Analytics endpoints
    analytics: {
        getAdminDashboard: async () => {
            return backendApiCall('/analytics/admin/dashboard');
        },

        getSellerInsights: async () => {
            return backendApiCall('/analytics/seller/insights');
        },

        getSearchSuggestions: async (query: string) => {
            return backendApiCall(`/analytics/search/suggestions?q=${encodeURIComponent(query)}`);
        },

        trackSearch: async (query: string, filters?: any) => {
            return backendApiCall('/analytics/search/track', {
                method: 'POST',
                body: JSON.stringify({ query, filters }),
            });
        },

        getPopularSearches: async () => {
            return backendApiCall('/analytics/search/popular');
        },

        getPropertyPerformance: async (propertyId: string) => {
            return backendApiCall(`/analytics/property/${propertyId}/performance`);
        },

        getCitywiseAnalytics: async () => {
            return backendApiCall('/analytics/citywise');
        },
    },

    // Payments endpoints
    payments: {
        createOrder: async (amount: number, planType: string, metadata?: any) => {
            return backendApiCall('/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount, planType, metadata }),
            });
        },

        verify: async (paymentData: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        }) => {
            return backendApiCall('/payment/verify', {
                method: 'POST',
                body: JSON.stringify(paymentData),
            });
        },

        getTransactionHistory: async () => {
            return backendApiCall('/payment/transactions');
        },

        getTransaction: async (transactionId: string) => {
            return backendApiCall(`/payment/transactions/${transactionId}`);
        },

        getPaymentStats: async () => {
            return backendApiCall('/payment/stats');
        },

        generateInvoice: async (transactionId: string) => {
            return backendApiCall(`/payment/invoice/${transactionId}`);
        },
    },

    // Subscriptions endpoints
    subscriptions: {
        getUserSubscription: async () => {
            return backendApiCall('/subscriptions/my-subscription');
        },

        create: async (planId: string, paymentId: string) => {
            return backendApiCall('/subscriptions', {
                method: 'POST',
                body: JSON.stringify({ planId, paymentId }),
            });
        },

        cancel: async (subscriptionId: string) => {
            return backendApiCall(`/subscriptions/${subscriptionId}/cancel`, {
                method: 'POST',
            });
        },

        checkStatus: async () => {
            return backendApiCall('/subscriptions/status');
        },

        getPlans: async () => {
            return backendApiCall('/subscriptions/plans');
        },
    },

    // Chatbot AI Assistant endpoints
    chatbot: {
        ask: async (data: {
            question: string;
            conversationHistory: any[];
            currentPage?: string;
            propertyId?: string;
        }) => {
            return backendApiCall('/chatbot/ask', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        requestAgent: async (data: {
            conversationHistory: any[];
            reason?: string;
        }) => {
            return backendApiCall('/chatbot/handoff', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        rate: async (data: {
            sessionId?: string | null;
            rating: number;
            feedback?: string;
            type: 'ai' | 'agent';
        }) => {
            return backendApiCall('/chatbot/rate', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getHistory: async (limit = 10) => {
            return backendApiCall(`/chatbot/history?limit=${limit}`);
        },

        getActiveSession: async () => {
            return backendApiCall('/chatbot/session');
        },

        clearHistory: async () => {
            return backendApiCall('/chatbot/history', {
                method: 'DELETE',
            });
        },
    },

    // Employee endpoints
    employee: {
        getTickets: async (status: string = 'all') => {
            return backendApiCall(`/employee/tickets?status=${status}`);
        },

        getActiveConversations: async () => {
            return backendApiCall('/employee/active-conversations');
        },

        sendQuickResponse: async (ticketId: string, templateId: string) => {
            return backendApiCall('/employee/quick-response', {
                method: 'POST',
                body: JSON.stringify({ ticketId, templateId }),
            });
        },

        getUserHistory: async (userId: string) => {
            return backendApiCall(`/employee/user-history/${userId}`);
        },

        getStats: async () => {
            return backendApiCall('/employee/stats');
        },
    },

    // Tickets endpoints
    tickets: {
        create: async (data: {
            categoryId: string;
            subCategoryId: string;
            categoryTitle: string;
            subCategoryTitle: string;
            problem: string;
            userRole: string;
        }) => {
            return backendApiCall('/tickets', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getUserTickets: async () => {
            return backendApiCall('/tickets');
        },

        getAllTickets: async () => {
            return backendApiCall('/tickets/employee/all');
        },

        getById: async (id: string) => {
            return backendApiCall(`/tickets/${id}`);
        },

        assign: async (id: string) => {
            return backendApiCall(`/tickets/${id}/assign`, {
                method: 'POST',
            });
        },

        sendMessage: async (id: string, message: string) => {
            return backendApiCall(`/tickets/${id}/messages`, {
                method: 'POST',
                body: JSON.stringify({ message }),
            });
        },

        close: async (id: string) => {
            return backendApiCall(`/tickets/${id}/close`, {
                method: 'PUT',
            });
        },

        uploadFile: async (id: string, file: File) => {
            const token = await getAuthToken();
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/tickets/${id}/files`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            return await response.json();
        },

        submitFeedback: async (id: string, rating: number) => {
            return backendApiCall(`/tickets/${id}/feedback`, {
                method: 'POST',
                body: JSON.stringify({ rating }),
            });
        },
    },
};
