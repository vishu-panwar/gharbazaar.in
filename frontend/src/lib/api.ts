// Backend API Client for GharBazaar
// Provides type-safe API calls to the backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || 'An error occurred',
      response.status,
      errorData.code
    );
  }
  return response.json();
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Create headers with auth
function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// ==================== AUTH API ====================

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<ApiResponse<{ token: string; user: any }>>(response);
  },

  signup: async (data: { email: string; password: string; displayName: string; role?: string }) => {
    const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<{ token: string; user: any }>>(response);
  },

  verifyToken: async (token: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse<ApiResponse<{ user: any }>>(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
      method: 'POST',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return handleResponse<ApiResponse>(response);
  },

  resetPassword: async (token: string, password: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    return handleResponse<ApiResponse>(response);
  },

  googleAuth: async (code: string) => {
    const response = await fetch(`${API_URL}/api/v1/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return handleResponse<ApiResponse<{ token: string; user: any }>>(response);
  },
};

// ==================== USER API ====================

export const userApi = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/api/v1/users/profile`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  updateProfile: async (data: { displayName?: string; photoURL?: string; phone?: string; address?: string }) => {
    const response = await fetch(`${API_URL}/api/v1/users/profile`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/api/v1/users/password`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<ApiResponse>(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_URL}/api/v1/users/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getById: async (userId: string) => {
    const response = await fetch(`${API_URL}/api/v1/users/${userId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },
};

// ==================== PROPERTY API ====================

export const propertyApi = {
  list: async (params?: {
    city?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }
    const response = await fetch(`${API_URL}/api/v1/properties?${searchParams}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/api/v1/properties/${id}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/api/v1/properties`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/api/v1/properties/${id}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/api/v1/properties/${id}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  getUserListings: async () => {
    const response = await fetch(`${API_URL}/api/v1/properties/user/me`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  trackView: async (id: string) => {
    const response = await fetch(`${API_URL}/api/v1/properties/${id}/view`, {
      method: 'POST',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  getMarketInsights: async () => {
    const response = await fetch(`${API_URL}/api/v1/properties/insights`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/api/v1/properties/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return handleResponse<ApiResponse<{ url: string }>>(response);
  },
};

// ==================== BID API ====================

export const bidApi = {
  placeBid: async (data: { propertyId: string; amount: number; message?: string }) => {
    const response = await fetch(`${API_URL}/api/v1/bids`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getBidsForProperty: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/api/v1/bids/property/${propertyId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getMyBids: async () => {
    const response = await fetch(`${API_URL}/api/v1/bids/my`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getBidsOnMyProperties: async () => {
    const response = await fetch(`${API_URL}/api/v1/bids/received`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  acceptBid: async (bidId: string) => {
    const response = await fetch(`${API_URL}/api/v1/bids/${bidId}/accept`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  rejectBid: async (bidId: string) => {
    const response = await fetch(`${API_URL}/api/v1/bids/${bidId}/reject`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  withdrawBid: async (bidId: string) => {
    const response = await fetch(`${API_URL}/api/v1/bids/${bidId}/withdraw`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// ==================== FAVORITE API ====================

export const favoriteApi = {
  add: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/api/v1/favorites`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ propertyId }),
    });
    return handleResponse<ApiResponse>(response);
  },

  remove: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/api/v1/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  getAll: async () => {
    const response = await fetch(`${API_URL}/api/v1/favorites`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  check: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/api/v1/favorites/check/${propertyId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<{ isFavorite: boolean }>>(response);
  },
};

// ==================== CHAT API ====================

export const chatApi = {
  getConversations: async () => {
    const response = await fetch(`${API_URL}/api/v1/chat/conversations`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getMessages: async (conversationId: string, params?: { limit?: number; before?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append('limit', String(params.limit));
    if (params?.before) searchParams.append('before', params.before);
    
    const response = await fetch(`${API_URL}/api/v1/chat/${conversationId}/messages?${searchParams}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  sendMessage: async (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    const response = await fetch(`${API_URL}/api/v1/chat/${conversationId}/messages`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ content, type }),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  createConversation: async (data: { participantId: string; propertyId?: string }) => {
    const response = await fetch(`${API_URL}/api/v1/chat/conversations`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  markAsRead: async (conversationId: string) => {
    const response = await fetch(`${API_URL}/api/v1/chat/${conversationId}/read`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  deleteMessage: async (conversationId: string, messageId: string) => {
    const response = await fetch(`${API_URL}/api/v1/chat/${conversationId}/messages/${messageId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// ==================== NOTIFICATION API ====================

export const notificationApi = {
  getAll: async (params?: { unreadOnly?: boolean; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.unreadOnly) searchParams.append('unreadOnly', 'true');
    if (params?.limit) searchParams.append('limit', String(params.limit));
    
    const response = await fetch(`${API_URL}/api/v1/notifications?${searchParams}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getUnreadCount: async () => {
    const response = await fetch(`${API_URL}/api/v1/notifications/unread-count`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<{ count: number }>>(response);
  },

  markAsRead: async (notificationId: string) => {
    const response = await fetch(`${API_URL}/api/v1/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  markAllAsRead: async () => {
    const response = await fetch(`${API_URL}/api/v1/notifications/read-all`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  delete: async (notificationId: string) => {
    const response = await fetch(`${API_URL}/api/v1/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  updatePreferences: async (preferences: {
    emailEnabled?: boolean;
    pushEnabled?: boolean;
    bidUpdates?: boolean;
    messageAlerts?: boolean;
    marketingEmails?: boolean;
  }) => {
    const response = await fetch(`${API_URL}/api/v1/notifications/preferences`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(preferences),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// ==================== VISIT API ====================

export const visitApi = {
  create: async (data: {
    propertyId: string;
    visitorName: string;
    visitorPhone: string;
    visitorEmail?: string;
    preferredDate: string;
    preferredTime?: string;
    message?: string;
  }) => {
    const response = await fetch(`${API_URL}/api/v1/visits`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getMyVisits: async () => {
    const response = await fetch(`${API_URL}/api/v1/visits/my`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getPropertyVisits: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/api/v1/visits/property/${propertyId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  approve: async (visitId: string) => {
    const response = await fetch(`${API_URL}/api/v1/visits/${visitId}/approve`, {
      method: 'PUT',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse>(response);
  },

  reject: async (visitId: string, reason?: string) => {
    const response = await fetch(`${API_URL}/api/v1/visits/${visitId}/reject`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ reason }),
    });
    return handleResponse<ApiResponse>(response);
  },

  complete: async (visitId: string, feedback?: string) => {
    const response = await fetch(`${API_URL}/api/v1/visits/${visitId}/complete`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify({ feedback }),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// ==================== TICKET API ====================

export const ticketApi = {
  create: async (data: {
    subject: string;
    category: string;
    priority?: string;
    message: string;
  }) => {
    const response = await fetch(`${API_URL}/api/v1/tickets`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getMyTickets: async () => {
    const response = await fetch(`${API_URL}/api/v1/tickets`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getById: async (ticketId: string) => {
    const response = await fetch(`${API_URL}/api/v1/tickets/${ticketId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  addMessage: async (ticketId: string, message: string, attachments?: string[]) => {
    const response = await fetch(`${API_URL}/api/v1/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify({ message, attachments }),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getMessages: async (ticketId: string) => {
    const response = await fetch(`${API_URL}/api/v1/tickets/${ticketId}/messages`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },
};

// ==================== PLAN API ====================

export const planApi = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/api/v1/plans`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any[]>>(response);
  },

  getById: async (planId: string) => {
    const response = await fetch(`${API_URL}/api/v1/plans/${planId}`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getMySubscription: async () => {
    const response = await fetch(`${API_URL}/api/v1/plans/subscription`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },
};

// ==================== CONTACT API ====================

export const contactApi = {
  submit: async (data: {
    username: string;
    userEmail: string;
    phone: string;
    subject: string;
    message: string;
  }) => {
    const response = await fetch(`${API_URL}/api/v1/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<ApiResponse>(response);
  },
};

// ==================== ANALYTICS API ====================

export const analyticsApi = {
  getDashboard: async () => {
    const response = await fetch(`${API_URL}/api/v1/analytics/dashboard`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getUserStats: async () => {
    const response = await fetch(`${API_URL}/api/v1/analytics/users`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },

  getPropertyStats: async () => {
    const response = await fetch(`${API_URL}/api/v1/analytics/properties`, {
      method: 'GET',
      headers: createHeaders(),
    });
    return handleResponse<ApiResponse<any>>(response);
  },
};

// ==================== BACKEND API (All Endpoints) ====================

export const backendApi = {
  auth: authApi,
  user: userApi,
  property: propertyApi,
  bid: bidApi,
  favorite: favoriteApi,
  chat: chatApi,
  notification: notificationApi,
  visit: visitApi,
  ticket: ticketApi,
  plan: planApi,
  contact: contactApi,
  analytics: analyticsApi,
};

export default backendApi;
