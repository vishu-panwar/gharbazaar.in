// Socket.IO Client for GharBazaar
// Provides real-time communication capabilities

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001';

let socket: Socket | null = null;

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

// Get or create socket connection
export const getOrCreateSocket = (token?: string): Socket => {
  // If socket exists and is connected, return it
  if (socket && (socket.connected || socket.io.engine?.writeBuffer?.length === 0)) {
    return socket;
  }

  // If socket exists but is disconnected, clean it up first
  if (socket && !socket.connected) {
    console.log('🧹 Cleaning up stale socket...');
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  const authToken = token || getAuthToken();

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 20, // Increased from 5 to 20
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000, // Max 10 seconds
    randomizationFactor: 0.5, // Add jitter for better reconnection
    timeout: 20000, // Connection timeout
    auth: authToken ? {
      token: authToken,
    } : undefined,
    transports: ['websocket', 'polling'], // Must match backend
    path: '/socket.io/', // Default path, but good to be explicit
    withCredentials: true,
  });

  // Do NOT register global listeners here - let SocketContext handle them
  // This prevents duplicate event handlers

  return socket;
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('📴 Socket disconnected manually');
  }
};

// Get current socket instance
export const getSocket = (): Socket | null => socket;

// Socket event helpers
export const socketHelpers = {
  // Join a conversation room
  joinConversation: (conversationId: string) => {
    socket?.emit('join_conversation', conversationId);
  },

  // Leave a conversation room
  leaveConversation: (conversationId: string) => {
    socket?.emit('leave_conversation', conversationId);
  },

  // Send a message
  sendMessage: (conversationId: string, content: string, type: 'text' | 'image' | 'file' = 'text') => {
    socket?.emit('send_message', { conversationId, content, type });
  },

  // Send typing indicator
  sendTyping: (conversationId: string, isTyping: boolean) => {
    socket?.emit('typing', { conversationId, isTyping });
  },

  // Mark messages as read
  markAsRead: (conversationId: string) => {
    socket?.emit('mark_as_read', { conversationId });
  },

  // Edit a message
  editMessage: (messageId: string, content: string) => {
    socket?.emit('edit_message', { messageId, content });
  },

  // Delete a message
  deleteMessage: (messageId: string) => {
    socket?.emit('delete_message', { messageId });
  },

  // Join property room (for live view updates)
  joinPropertyRoom: (propertyId: string) => {
    socket?.emit('join_property', propertyId);
  },

  // Leave property room
  leavePropertyRoom: (propertyId: string) => {
    socket?.emit('leave_property', propertyId);
  },

  // Subscribe to notifications
  subscribeNotifications: () => {
    socket?.emit('subscribe_notifications');
  },
};

export default {
  getOrCreateSocket,
  disconnectSocket,
  getSocket,
  ...socketHelpers,
};
