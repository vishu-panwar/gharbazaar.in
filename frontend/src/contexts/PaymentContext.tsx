import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { backendApi } from '@/lib/backendApi';
import { useAuth } from './AuthContext';

interface Plan {
    id: string;
    name: string;
    type: string;
    displayName?: string;
    features: {
        viewLimit?: number;
        contactAccess?: boolean;
        mapAccess?: boolean;
        bidAccess?: boolean;
        listingLimit?: number;
        directContact?: boolean;
        [key: string]: any;
    };
    expiryDate?: string;
    usage?: {
        viewsUsed?: number;
        contactsUsed?: number;
        listingsUsed?: number;
    };
}

interface PaymentContextType {
    hasPaid: boolean;
    currentPlan: Plan | null;
    setPaid: () => void;
    setPlan: (plan: Plan) => void;
    clearPayment: () => void;
    hasFeature: (feature: string) => boolean;
    refreshPlan: () => Promise<void>;
    loadingPlan: boolean;
}

const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType);

const LOCAL_PLAN_KEY = 'gharbazaar_user_plan';
const LOCAL_PAID_KEY = 'gharbazaar_payment_status';

const toNumber = (value: any): number => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};

const buildPlanFromBackend = (payload: any): Plan | null => {
    const plan = payload?.plan;
    const userPlan = payload?.userPlan;
    if (!plan || !userPlan) return null;

    const viewsUsed = toNumber(userPlan?.usage?.viewsUsed);
    const contactsUsed = toNumber(userPlan?.usage?.contactsUsed);
    const listingsUsed = toNumber(userPlan?.usage?.listingsUsed);

    const viewLimit = toNumber(plan.viewLimit);
    const listingLimit = toNumber(plan.listingLimit);

    const remainingViews = Math.max(0, viewLimit - viewsUsed);
    const remainingListings = Math.max(0, listingLimit - listingsUsed);

    return {
        id: String(plan.id),
        name: String(plan.name || plan.displayName || 'active-plan'),
        displayName: String(plan.displayName || plan.name || 'Active Plan'),
        type: String(plan.type || ''),
        expiryDate: userPlan.endDate,
        usage: {
            viewsUsed,
            contactsUsed,
            listingsUsed,
        },
        features: {
            viewLimit: remainingViews,
            listingLimit: remainingListings,
            contactAccess: Boolean(plan.directContact),
            directContact: Boolean(plan.directContact),
            bidAccess: Boolean(plan.directContact),
            mapAccess: true,
            prioritySupport: Boolean(plan.prioritySupport),
            verifiedBadge: Boolean(plan.verifiedBadge),
        },
    };
};

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment must be used within PaymentProvider');
    }
    return context;
};

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [hasPaid, setHasPaid] = useState(false);
    const [currentPlan, setCurrentPlan] = useState<Plan | null>(null);
    const [loadingPlan, setLoadingPlan] = useState(true);

    const persistLocalState = useCallback((plan: Plan | null, paid: boolean) => {
        if (typeof window === 'undefined') return;

        if (plan) {
            localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(plan));
        } else {
            localStorage.removeItem(LOCAL_PLAN_KEY);
        }

        if (paid) {
            localStorage.setItem(LOCAL_PAID_KEY, 'paid');
        } else {
            localStorage.removeItem(LOCAL_PAID_KEY);
        }
    }, []);

    const refreshPlan = useCallback(async () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setCurrentPlan(null);
            setHasPaid(false);
            setLoadingPlan(false);
            return;
        }

        try {
            setLoadingPlan(true);
            const response = await backendApi.plans.getUserPlan();

            if (response?.success && response?.data) {
                const normalized = buildPlanFromBackend(response.data);
                if (normalized) {
                    setCurrentPlan(normalized);
                    setHasPaid(true);
                    persistLocalState(normalized, true);
                    return;
                }
            }

            // No active backend plan
            setCurrentPlan(null);
            setHasPaid(false);
            persistLocalState(null, false);
        } catch (error) {
            // Soft fallback to local cache if backend is unavailable.
            const storedPlan = localStorage.getItem(LOCAL_PLAN_KEY);
            const storedPaid = localStorage.getItem(LOCAL_PAID_KEY) === 'paid';

            if (storedPlan) {
                try {
                    const parsed = JSON.parse(storedPlan) as Plan;
                    setCurrentPlan(parsed);
                    setHasPaid(storedPaid || Boolean(parsed));
                } catch {
                    setCurrentPlan(null);
                    setHasPaid(false);
                }
            } else {
                setCurrentPlan(null);
                setHasPaid(storedPaid);
            }
        } finally {
            setLoadingPlan(false);
        }
    }, [persistLocalState]);

    useEffect(() => {
        // Bootstrap from local cache quickly, then refresh from backend.
        if (typeof window !== 'undefined') {
            const storedPlan = localStorage.getItem(LOCAL_PLAN_KEY);
            const storedPaid = localStorage.getItem(LOCAL_PAID_KEY) === 'paid';

            if (storedPlan) {
                try {
                    const parsed = JSON.parse(storedPlan) as Plan;
                    setCurrentPlan(parsed);
                    setHasPaid(storedPaid || Boolean(parsed));
                } catch {
                    setCurrentPlan(null);
                    setHasPaid(storedPaid);
                }
            } else {
                setHasPaid(storedPaid);
            }
        }

        refreshPlan();
    }, [refreshPlan]);

    useEffect(() => {
        if (!user) {
            setCurrentPlan(null);
            setHasPaid(false);
            setLoadingPlan(false);
            return;
        }

        refreshPlan();
    }, [user?.uid, refreshPlan, user]);

    const setPaid = () => {
        // Backward compatibility fallback. Real source should be refreshPlan().
        setHasPaid(true);
        persistLocalState(currentPlan, true);
    };

    const setPlan = (plan: Plan) => {
        setCurrentPlan(plan);
        setHasPaid(true);
        persistLocalState(plan, true);
    };

    const clearPayment = () => {
        setHasPaid(false);
        setCurrentPlan(null);
        persistLocalState(null, false);
    };

    const hasFeature = (feature: string): boolean => {
        if (!currentPlan) return hasPaid;

        const featureValue = currentPlan.features?.[feature];
        if (typeof featureValue === 'boolean') return featureValue;
        if (typeof featureValue === 'number') return featureValue > 0;

        // Reasonable defaults for legacy feature checks.
        if (feature === 'contactAccess' || feature === 'bidAccess') {
            return Boolean(currentPlan.features?.directContact || hasPaid);
        }
        if (feature === 'mapAccess') return hasPaid;

        return hasPaid;
    };

    const value = {
        hasPaid,
        currentPlan,
        setPaid,
        setPlan,
        clearPayment,
        hasFeature,
        refreshPlan,
        loadingPlan,
    };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
