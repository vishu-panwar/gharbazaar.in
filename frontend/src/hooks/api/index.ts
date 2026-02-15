/**
 * Centralized API Hooks Library
 * 
 * Production-grade React Query hooks for all backend API endpoints.
 * All hooks provide: loading states, error handling, caching, and optimistic updates.
 */

// Authentication & Users
export * from './useAuth';

// Properties & Favorites
export * from './useProperties';
export * from './useFavorites';

// Communication
export * from './useChat';
export * from './useNotifications';

// Transactions
export * from './useBids';
export * from './useContracts';
export * from './usePayments';

// Visits
export * from './useVisits';

// Settings
export * from './useSettings';

// Analytics
export * from './useAnalytics';

// Partners
export * from './usePartners';

// Admin
export * from './useAdmin';

// Employee
export * from './useEmployee';

// KYC
export * from './useKYC';

// Tickets
export * from './useTickets';

// Plans/Subscriptions
export * from './usePlans';
