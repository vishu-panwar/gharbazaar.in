// Backend API integration utilities
import { CONFIG } from '@/config';

const API_BASE_URL = CONFIG.API.FULL_URL;
const AUTH_API_BASE_URL = CONFIG.AUTH_API.FULL_URL;

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
 * Make API call to external authentication API (Koyeb with SMTP)
 */
async function authApiCall(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    try {
        // Dynamic config lookup [auth-v6]
        const conf = CONFIG.AUTH_API;
        const baseUrl = conf.BASE_URL || conf.FULL_URL;
        const normalizedBase = baseUrl.includes('/api/v1')
            ? baseUrl.replace(/\/$/, '')
            : `${baseUrl.replace(/\/$/, '')}/api/v1`;

        // Build full URL - endpoint should include /auth or /verify paths
        const url = `${normalizedBase}${endpoint}`;

        console.log(`📡 [auth-v6] Calling: ${url}`);

        const response = await fetch(url, {
            ...options,
            headers,
            mode: 'cors',
            credentials: 'omit',
        });

        console.log(`📡 [auth-v6] Status: ${response.status} from ${url}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            if (errorData) {
                const message = errorData.message || errorData.error || errorData.detail;
                if (message) {
                    throw new Error(`[auth-v6] ${typeof message === 'string' ? message : JSON.stringify(message)}`);
                }
            }
            throw new Error(`[auth-v6] HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('❌ [auth-v6] Error:', error);
        throw error;
    }
}

/**
 * Make authenticated API call to local backend (for properties, messages, etc.)
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

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    } else {
        const text = await response.text();
        if (!response.ok) {
            throw new Error(text || `HTTP ${response.status}`);
        }
        return text;
    }
}

/**
 * Backend API endpoints for property workflow and authentication
 */
export const backendApi = {
    // Authentication endpoints (using external Koyeb API with SMTP)
    auth: {
        /**
         * Register new user
         * Backend API endpoint: POST /api/v1/auth/register
         */
        register: async (data: {
            email: string;
            password: string;
            displayName: string;
            role?: string;
        }) => {
            const response = await authApiCall('/auth/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.displayName,
                    role: data.role || 'buyer',
                }),
            });

            // Store token if returned
            if (response.token && typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);

                // If user data is missing, fetch it automatically (Koyeb pattern)
                if (!response.user && !response.data?.user) {
                    console.log('🔄 Fetching user profile after signup...');
                    const profile = await backendApi.auth.verifyToken(response.token);
                    if (profile.success && profile.data) {
                        response.user = profile.data.user;
                    }
                }
            }

            return response;
        },

        /**
         * Login user
         * Backend API endpoint: POST /api/v1/auth/login
         */
        login: async (email: string, password: string) => {
            const response = await authApiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            // Store token if returned
            if (response.token && typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);

                // If user data is missing, fetch it automatically (Koyeb pattern)
                if (!response.user && !response.data?.user) {
                    console.log('🔄 Fetching user profile after login...');
                    const profile = await backendApi.auth.verifyToken(response.token);
                    if (profile.success && profile.data) {
                        response.user = profile.data.user;
                    }
                }
            }

            return response;
        },

        /**
         * Google OAuth login (redirect-based flow)
         * Backend API endpoint: POST /api/v1/auth/google?code=xxx
         */
        googleLogin: async (authCode: string, role?: string) => {
            let url = `/auth/google?code=${encodeURIComponent(authCode)}`;
            if (role) {
                url += `&role=${encodeURIComponent(role)}`;
            }
            const response = await authApiCall(url, {
                method: 'POST',
            });


            // Store token if returned
            if (response.token && typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);

                // If user data is missing, fetch it automatically (Koyeb pattern)
                if (!response.user && !response.data?.user) {
                    console.log('🔄 Fetching user profile after google login...');
                    const profile = await backendApi.auth.verifyToken(response.token);
                    if (profile.success && profile.data) {
                        response.user = profile.data.user;
                    }
                }
            }

            return response;
        },

        /**
         * Forgot password - sends reset email via SMTP
         * Backend API endpoint: POST /api/v1/auth/forgot-password
         */
        forgotPassword: async (email: string) => {
            return authApiCall('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });
        },

        /**
         * Verify email with token
         * External API endpoint: POST /verify/email
         */
        verifyEmail: async (token: string) => {
            return authApiCall('/verify/email', {
                method: 'PUT',
                body: JSON.stringify({ token }),
            });
        },

        /**
         * Reset password with token
         * External API endpoint: POST /verify/reset-password
         */
        resetPassword: async (token: string, newPassword: string) => {
            return authApiCall('/verify/reset-password', {
                method: 'PUT',
                body: JSON.stringify({ token, newPassword }),
            });
        },

        /**
         * Verify token and fetch user data (Koyeb compatible)
         */
        verifyToken: async (token: string) => {
            try {
                // Use safe base URL dynamically [auth-v6]
                const conf = CONFIG.AUTH_API;
                const safeBaseUrl = (conf.FULL_URL || conf.BASE_URL).replace(/\/v1(\/|$)/, '/').replace(/\/$/, '');

                // Try canonical backend profile endpoints first to avoid noisy 404 probing
                // Try canonical backend profile endpoints first to avoid noisy 404 probing
                const endpoints = [
                    `${CONFIG.API.FULL_URL}/users/profile`,
                    `${AUTH_API_BASE_URL.replace(/\/$/, '')}/users/profile`,
                ];

                let lastError = null;
                let lastStatus = 500;

                for (const url of endpoints) {
                    try {
                        console.log(`📡 [auth-v6] Fetching: ${url}`);
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': 'application/json'
                            },
                            mode: 'cors',
                            credentials: 'omit'
                        });

                        if (response.ok) {
                            const data = await response.json();
                            console.log(`✅ Success from ${url}`);

                            const user = data.data || data.user || (Array.isArray(data) ? data[0] : data);

                            if (user) {
                                // Minimal mapping (keep existing behavior)
                                let name = user.name || user.displayName || user.fullName;
                                if ((!name || name.toLowerCase() === 'user') && token && token.includes('.')) {
                                    try {
                                        const payload = JSON.parse(atob(token.split('.')[1]));
                                        name = payload.name || payload.displayName || payload.fullName || payload.given_name || name;
                                    } catch (e) { }
                                }
                                if (!name) name = user.email?.split('@')[0] || 'User';

                                const mappedUser = {
                                    uid: String(user.id || user.uid || user.sub || user._id || 'koyeb-user'),
                                    email: user.email || user.emailAddress || 'user@example.com',
                                    name: name,
                                    displayName: name,
                                    role: (user.role || 'buyer').toLowerCase(),
                                    photoURL: user.picture || user.photoURL || user.avatar || null
                                };
                                console.log('👤 Mapped user:', mappedUser.displayName);
                                return { success: true, data: { user: mappedUser } };
                            }
                        }

                        lastStatus = response.status;
                        lastError = `HTTP ${response.status}`;
                        console.warn(`⚠️ Failed ${url}: ${lastError}`);
                    } catch (e: any) {
                        lastError = e.message;
                    }
                }

                // 2. Fallback to Local JWT Decoding (Soft Verification)
                if (token && token.includes('.')) {
                    console.log('⚠️ Remote verification failed. Attempting local JWT decode...');
                    try {
                        const base64Url = token.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));

                        const payload = JSON.parse(jsonPayload);
                        const currentTime = Date.now() / 1000;

                        if (payload.exp && payload.exp < currentTime) {
                            return { success: false, error: 'Token expired', status: 401 };
                        }

                        console.log('✅ Local JWT verification success');

                        // Robust mapping
                        const email = payload.email || payload.emailAddress || payload.unique_name || 'user@example.com';
                        const name = payload.name || payload.displayName || payload.fullName ||
                            (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}` : null) ||
                            payload.given_name || payload.nickname || email.split('@')[0] || 'User';

                        const mappedUser = {
                            uid: String(payload.sub || payload.id || payload._id || payload.uid || payload.oid || 'jwt-user'),
                            email: email,
                            name: name,
                            displayName: name,
                            role: (payload.role || 'buyer').toLowerCase(),
                            photoURL: payload.picture || payload.photoURL || payload.avatar || null
                        };

                        console.log('👤 Locally mapped user:', mappedUser.displayName);

                        return {
                            success: true,
                            data: { user: mappedUser }
                        };
                    } catch (e) {
                        console.error('❌ Local JWT decode failed:', e);
                    }
                }

                return { success: false, error: lastError || 'Verification failed', status: lastStatus };
            } catch (error: any) {
                console.error('❌ verifyToken exception:', error);
                return { success: false, error: error.message };
            }
        },

        /**
         * Refresh token (keep using local backend for now)
         */
        refreshToken: async (refreshToken: string) => {
            return backendApiCall('/auth/refresh-token', {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            });
        },

        /**
         * Logout user
         */
        logout: async () => {
            // Clear local token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
            }

            // Optionally call backend logout if needed
            try {
                return await backendApiCall('/auth/logout', {
                    method: 'POST',
                });
            } catch (error) {
                console.error('Logout error:', error);
                return { success: true };
            }
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

        uploadImage: async (file: File) => {
            const formData = new FormData();
            formData.append('image', file);

            const token = await getAuthToken();
            const url = `${API_BASE_URL}/properties/upload`;

            console.log(`📤 Uploading image to: ${url}`);

            if (!token) {
                console.error('❌ No auth token found for upload');
                throw new Error('Not authenticated');
            }

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: formData,
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    console.error('❌ Upload failed response:', data);
                    throw new Error(data.error || `Upload failed with status ${response.status}`);
                }

                return data;
            } catch (error) {
                console.error('❌ Upload error:', error);
                throw error;
            }
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

        async delete(propertyId: string) {
            return backendApiCall(`/properties/${propertyId}`, {
                method: 'DELETE',
            });
        },
    },

    // Favorites endpoints
    favorites: {
        get: async () => {
            return backendApiCall('/favorites');
        },

        toggle: async (propertyId: string) => {
            return backendApiCall('/favorites/toggle', {
                method: 'POST',
                body: JSON.stringify({ propertyId }),
            });
        },

        sync: async (propertyIds: (string | number)[]) => {
            return backendApiCall('/favorites/sync', {
                method: 'POST',
                body: JSON.stringify({ propertyIds }),
            });
        },
    },

    // Admin endpoints
    admin: {
        getAllProperties: async () => {
            return backendApiCall('/admin/properties');
        },

        updatePropertyStatus: async (propertyId: string, status: string, reason?: string) => {
            return backendApiCall(`/admin/properties/${propertyId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status, reason }),
            });
        },

        deleteProperty: async (propertyId: string) => {
            return backendApiCall(`/admin/properties/${propertyId}`, {
                method: 'DELETE',
            });
        },

        approveProperty: async (propertyId: string) => {
            return backendApi.admin.updatePropertyStatus(propertyId, 'active');
        },

        rejectProperty: async (propertyId: string, reason: string) => {
            return backendApi.admin.updatePropertyStatus(propertyId, 'rejected', reason);
        },

        getAllUsers: async () => {
            return backendApiCall('/admin/users');
        },

        getAnalytics: async () => {
            return backendApiCall('/admin/analytics');
        },

        // Employee Management
        getAllClients: async () => {
            return backendApiCall('/admin/users');
        },

        deleteClient: async (id: string) => {
            return backendApiCall(`/admin/users/${id}`, {
                method: 'DELETE'
            });
        },

        getDashboardStats: async () => {
            return backendApiCall('/admin/stats');
        },

        listEmployees: async () => {
            return backendApiCall('/admin/employees');
        },

        addEmployee: async (data: {
            email: string;
            password: string;
            name: string;
            department?: string;
            designation?: string;
        }) => {
            return backendApiCall('/admin/employees', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        removeEmployee: async (uid: string) => {
            return backendApiCall(`/admin/employees/${uid}`, {
                method: 'DELETE',
            });
        },

        updateEmployeeProfile: async (uid: string, data: any) => {
            return backendApiCall(`/admin/employees/${uid}/profile`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });
        },

        getSalary: async (filters: { month?: string; year?: number } = {}) => {
            const params = new URLSearchParams(filters as any).toString();
            return backendApiCall(`/admin/salary?${params}`);
        },

        processSalary: async (data: any) => {
            return backendApiCall('/admin/salary/process', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },


        broadcastAnnouncement: async (data: {
            target: string;
            title: string;
            message: string;
            link?: string;
            priority?: string;
        }) => {
            return backendApiCall('/admin/announcements', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        database: {
            export: async () => {
                return backendApiCall('/admin/database/export');
            },
            import: async (backupData: any) => {
                return backendApiCall('/admin/database/import', {
                    method: 'POST',
                    body: JSON.stringify({ backupData }),
                });
            },
            listBackups: async () => {
                return backendApiCall('/admin/database/backups');
            },
            createBackup: async () => {
                return backendApiCall('/admin/database/backup', {
                    method: 'POST',
                });
            },
            restoreBackup: async (fileName: string) => {
                return backendApiCall('/admin/database/restore', {
                    method: 'POST',
                    body: JSON.stringify({ fileName }),
                });
            },
        },
    },

    // Attendance endpoints
    attendance: {
        mark: async (data: { status?: string; location?: any; notes?: string; checkOut?: boolean }) => {
            return backendApiCall('/attendance/mark', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },

        getHistory: async (filters: { userId?: string; startDate?: string; endDate?: string } = {}) => {
            const params = new URLSearchParams(filters as any).toString();
            return backendApiCall(`/attendance/history?${params}`);
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

    // Plans and Subscriptions
    plans: {
        getAll: async () => {
            return backendApiCall('/plans');
        },
        getUserPlan: async () => {
            return backendApiCall('/user/plan');
        },
        purchase: async (planId: string, paymentId: string) => {
            return backendApiCall('/user/plan/purchase', {
                method: 'POST',
                body: JSON.stringify({ planId, paymentId }),
            });
        },
    },

    // Market Data
    market: {
        getInsights: async () => {
            return backendApiCall('/properties/insights');
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

    // Partner ecosystem endpoints
    partners: {
        createCase: async (data: {
            type: string;
            title: string;
            description?: string;
            propertyId?: string;
            buyerId?: string;
            sellerId?: string;
            amount?: number;
            dueDate?: string;
            metadata?: any;
        }) => {
            return backendApiCall('/partners/cases', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getCases: async (params?: { status?: string; type?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return backendApiCall(`/partners/cases${query ? `?${query}` : ''}`);
        },
        updateCase: async (id: string, data: any) => {
            return backendApiCall(`/partners/cases/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
        createReferral: async (data: { referralCode: string; leadName: string; leadContact: string; metadata?: any }) => {
            return backendApiCall('/partners/referrals', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getReferrals: async (status?: string) => {
            return backendApiCall(`/partners/referrals${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        getPayouts: async (status?: string) => {
            return backendApiCall(`/partners/payouts${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        createPayout: async (data: any) => {
            return backendApiCall('/partners/payouts', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
    },

    // Payments endpoints
    payments: {
        createOrder: async (amount: number, paymentMethod: string, metadata?: any) => {
            return backendApiCall('/payments/create', {
                method: 'POST',
                body: JSON.stringify({ amount, currency: 'INR', serviceId: paymentMethod, metadata }),
            });
        },

        verify: async (paymentData: {
            orderId: string;
            paymentId: string;
            signature?: string;
        }) => {
            return backendApiCall('/payments/verify', {
                method: 'POST',
                body: JSON.stringify(paymentData),
            });
        },

        list: async () => {
            return backendApiCall('/payments');
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

    // Visits endpoints
    visits: {
        create: async (data: {
            propertyId: string;
            scheduledAt?: string;
            notes?: string;
            address?: string;
            location?: { lat?: number; lng?: number };
            buyerId?: string;
            partnerId?: string;
        }) => {
            return backendApiCall('/visits', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getBuyer: async (status?: string) => {
            return backendApiCall(`/visits/buyer${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        getSeller: async (status?: string) => {
            return backendApiCall(`/visits/seller${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        getPartner: async (status?: string) => {
            return backendApiCall(`/visits/partner${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        update: async (id: string, data: {
            status?: string;
            scheduledAt?: string;
            notes?: string;
            partnerId?: string;
        }) => {
            return backendApiCall(`/visits/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
    },

    // Verification endpoints
    verification: {
        createTask: async (data: {
            propertyId: string;
            assignedTo?: string;
            taskType?: string;
            checklist?: string[];
            dueDate?: string;
            notes?: string;
        }) => {
            return backendApiCall('/verification/tasks', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getTasks: async (params?: { assignedTo?: string; propertyId?: string; status?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return backendApiCall(`/verification/tasks${query ? `?${query}` : ''}`);
        },
        updateTask: async (id: string, data: any) => {
            return backendApiCall(`/verification/tasks/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
            });
        },
        createReport: async (data: {
            taskId: string;
            propertyId: string;
            reportType?: string;
            findings?: string;
            recommendation?: string;
            uploadedFiles?: string[];
            notes?: string;
        }) => {
            return backendApiCall('/verification/reports', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getReports: async (params?: { taskId?: string; propertyId?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return backendApiCall(`/verification/reports${query ? `?${query}` : ''}`);
        },
    },

    // Contracts endpoints
    contracts: {
        create: async (data: {
            propertyId: string;
            bidId?: string;
            buyerId?: string;
            sellerId?: string;
            agreedPrice: number;
            terms?: string;
        }) => {
            return backendApiCall('/contracts', {
                method: 'POST',
                body: JSON.stringify(data),
            });
        },
        getBuyer: async (status?: string) => {
            return backendApiCall(`/contracts/buyer${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        getSeller: async (status?: string) => {
            return backendApiCall(`/contracts/seller${status ? `?status=${encodeURIComponent(status)}` : ''}`);
        },
        sign: async (id: string) => {
            return backendApiCall(`/contracts/${id}/sign`, {
                method: 'PATCH',
            });
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

        getPendingProperties: async () => {
            return backendApiCall('/employee/pending-properties');
        },

        approveProperty: async (id: string) => {
            return backendApiCall(`/employee/approve-property/${id}`, {
                method: 'POST',
            });
        },

        rejectProperty: async (id: string, reason: string) => {
            return backendApiCall(`/employee/reject-property/${id}`, {
                method: 'POST',
                body: JSON.stringify({ reason }),
            });
        },

        getApprovedProperties: async () => {
            return backendApiCall('/employee/approved-properties');
        },

        togglePropertyPause: async (id: string) => {
            return backendApiCall(`/employee/toggle-property-pause/${id}`, {
                method: 'POST'
            });
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

    // Contact form endpoints (using external Koyeb API as requested)
    contact: {
        sendMessage: async (data: {
            name: string;
            email: string;
            phone?: string;
            subject: string;
            message: string;
        }) => {
            // Format phone number to match Koyeb API requirements (+countrycode digits)
            let formattedPhone = data.phone;
            if (formattedPhone) {
                // Remove all non-digit characters except +
                formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
                // If it doesn't start with +, add +91 as default (India) if 10 digits, else just add +
                if (!formattedPhone.startsWith('+')) {
                    if (formattedPhone.length === 10) {
                        formattedPhone = `+91${formattedPhone}`;
                    } else if (formattedPhone.length > 0) {
                        formattedPhone = `+${formattedPhone}`;
                    }
                }
            }

            // Direct call to external Koyeb API
            const url = 'https://strict-matty-gharbazaar1-60d0c804.koyeb.app/api/forms';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    phone: formattedPhone || undefined
                }),
                mode: 'cors'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                if (errorData) {
                    // Extract validation messages if they exist
                    if (typeof errorData === 'object') {
                        const messages = Object.entries(errorData)
                            .map(([field, msg]) => `${field}: ${msg}`)
                            .join('\n');
                        throw new Error(messages || JSON.stringify(errorData));
                    }
                    throw new Error(String(errorData));
                }
                throw new Error(`API Error ${response.status}`);
            }

            return await response.json();
        },
    },
};
