'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, CreditCard, Home } from 'lucide-react';
import PaymentForm from '@/components/payment/PaymentForm';
import { backendApi } from '@/lib/backendApi';
import { usePayment } from '@/contexts/PaymentContext';
import { useModal } from '@/contexts/ModalContext';
import { useAuth } from '@/contexts/AuthContext';

interface BackendPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  price: number | string;
  durationDays: number;
  listingLimit: number;
  consultationLimit: number;
  featuredLimit: number;
  isPopular?: boolean;
}

export default function SellerDashboardPricingPage() {
  const { refreshPlan } = usePayment();
  const { showAlert } = useModal();
  const { user } = useAuth();

  const [plans, setPlans] = useState<BackendPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<BackendPlan | null>(null);

  const [userDetails, setUserDetails] = useState({
    name: user?.displayName || user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  useEffect(() => {
    setUserDetails((prev) => ({
      ...prev,
      name: user?.displayName || user?.name || prev.name,
      email: user?.email || prev.email,
    }));
  }, [user?.displayName, user?.name, user?.email]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoadingPlans(true);
        const response = await backendApi.plans.getAll();
        const rawPlans = Array.isArray(response?.data) ? response.data : [];

        const sellerPlans = rawPlans.filter(
          (plan: BackendPlan) => plan.type === 'seller' || plan.type === 'combined'
        );

        setPlans(sellerPlans);
      } catch (error) {
        console.error('Failed to load plans:', error);
        setPlans([]);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => Number(a.price) - Number(b.price)),
    [plans]
  );

  const handleSelectPlan = (plan: BackendPlan) => {
    setCurrentPlan(plan);
    setShowPaymentForm(true);
  };

  const handleBackToPlans = () => {
    setCurrentPlan(null);
    setShowPaymentForm(false);
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    if (!currentPlan) return;

    try {
      const paymentId =
        paymentData?.transactionId || paymentData?.paymentId || `pay_${Date.now()}`;

      const purchaseResponse = await backendApi.plans.purchase(currentPlan.id, paymentId);
      if (!purchaseResponse?.success) {
        throw new Error(purchaseResponse?.message || 'Plan purchase failed');
      }

      await refreshPlan();

      showAlert({
        title: 'Plan Activated',
        message: `${currentPlan.displayName || currentPlan.name} is now active. You can add listings now.`,
        type: 'success',
      });

      handleBackToPlans();
    } catch (error: any) {
      showAlert({
        title: 'Activation Failed',
        message: error?.message || 'Payment succeeded but seller plan activation failed.',
        type: 'error',
      });
    }
  };

  const handlePaymentError = (error: string) => {
    showAlert({
      title: 'Payment Failed',
      message: error,
      type: 'error',
    });
  };

  if (showPaymentForm && currentPlan) {
    return (
      <div className="space-y-6">
        <button
          onClick={handleBackToPlans}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
        >
          Back to Plans
        </button>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complete Payment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {currentPlan.displayName || currentPlan.name}
          </p>
          <p className="text-3xl font-bold text-green-600 mt-4">
            INR {Number(currentPlan.price).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Your Details</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Full Name"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
            <input
              type="email"
              value={userDetails.email}
              onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />
            <input
              type="tel"
              value={userDetails.phone}
              onChange={(e) => setUserDetails((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone"
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent md:col-span-2"
            />
          </div>
        </div>

        <PaymentForm
          amount={Number(currentPlan.price)}
          serviceName={currentPlan.displayName || currentPlan.name}
          userDetails={userDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          loading={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Seller Plans</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Activate a seller plan to publish listings and manage buyer inquiries.
        </p>
      </div>

      {loadingPlans ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          Loading plans...
        </div>
      ) : sortedPlans.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
          No seller plans are available right now.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {plan.displayName || plan.name}
                </h2>
                {plan.isPopular ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Popular</span>
                ) : null}
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 min-h-[48px]">
                {plan.description}
              </p>

              <p className="text-3xl font-bold text-green-600 mt-4">
                INR {Number(plan.price).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-gray-500 mt-1">{plan.durationDays} days</p>

              <ul className="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  Up to {plan.listingLimit} listings
                </li>
                <li className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  {plan.consultationLimit} inquiries
                </li>
                <li className="flex items-center gap-2">
                  <Home size={16} className="text-gray-500" />
                  {plan.featuredLimit} featured slots
                </li>
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className="mt-6 w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <span className="inline-flex items-center gap-2">
                  <CreditCard size={16} />
                  Pay & Activate
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
