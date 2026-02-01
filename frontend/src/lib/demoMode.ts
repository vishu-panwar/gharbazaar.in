/**
 * Demo Mode Utility
 * Allows bypassing authentication for demo/testing purposes
 */

export const DEMO_MODE_KEY = 'demo_mode';
export const DEMO_USER_KEY = 'demo_user';

export interface DemoUser {
    uid: string;
    email: string;
    displayName: string;
    role: 'buyer' | 'seller' | 'admin' | 'employee' | 'legal-partner' | 'ground-partner' | 'promo-partner';
}

const DEMO_USERS: Record<string, DemoUser> = {
    buyer: {
        uid: 'demo-buyer-001',
        email: 'buyer@demo.com',
        displayName: 'Demo Buyer',
        role: 'buyer',
    },
    admin: {
        uid: 'demo-admin-001',
        email: 'admin@demo.com',
        displayName: 'Demo Admin',
        role: 'admin',
    },
    employee: {
        uid: 'demo-employee-001',
        email: 'employee@demo.com',
        displayName: 'Demo Employee',
        role: 'employee',
    },
    legal: {
        uid: 'demo-legal-001',
        email: 'legal@demo.com',
        displayName: 'Demo Legal Partner',
        role: 'legal-partner',
    },
    ground: {
        uid: 'demo-ground-001',
        email: 'ground@demo.com',
        displayName: 'Demo Ground Partner',
        role: 'ground-partner',
    },
    partner: {
        uid: 'demo-partner-001',
        email: 'partner@demo.com',
        displayName: 'Demo Promo Partner',
        role: 'promo-partner',
    },
};

/**
 * Enable demo mode with a specific user role
 */
export function enableDemoMode(role: keyof typeof DEMO_USERS): void {
    if (typeof window === 'undefined') return;

    const demoUser = DEMO_USERS[role];
    localStorage.setItem(DEMO_MODE_KEY, 'true');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
}

/**
 * Disable demo mode
 */
export function disableDemoMode(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(DEMO_MODE_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
}

/**
 * Check if demo mode is active
 */
export function isDemoMode(): boolean {
    if (typeof window === 'undefined') return false;

    return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

/**
 * Get current demo user
 */
export function getDemoUser(): DemoUser | null {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem(DEMO_USER_KEY);
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

/**
 * Get demo user mock Firebase token
 */
export function getDemoToken(): string {
    const demoUser = getDemoUser();
    if (!demoUser) return '';

    // Return a mock token for demo purposes
    return `demo-token-${demoUser.uid}`;
}
