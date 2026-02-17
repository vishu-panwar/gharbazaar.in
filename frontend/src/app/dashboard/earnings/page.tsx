'use client';

import { useState } from 'react';
import { useEarnings, usePayouts, useRequestPayout, useTransactions } from '@/hooks/api';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency, convertCurrency } from '@/lib/currency';
import { StatsCard, StatsGrid } from '@/components/StatsCard';
import {
  Wallet,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EarningsPage() {
  const { data: earnings, isLoading: earningsLoading } = useEarnings();
  const { data: payouts, isLoading: payoutsLoading } = usePayouts();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const requestPayout = useRequestPayout();

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'transactions' | 'payouts'>('overview');

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    if (parseFloat(payoutAmount) > (earnings?.availableBalance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await requestPayout.mutateAsync({ amount: parseFloat(payoutAmount) });
      toast.success('Payout request submitted!');
      setShowPayoutModal(false);
      setPayoutAmount('');
    } catch (error) {
      toast.error('Failed to request payout');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const isLoading = earningsLoading || payoutsLoading || transactionsLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Earnings</h1>
        <LoadingSkeleton variant="dashboard" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your income and request payouts
          </p>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          disabled={!earnings?.availableBalance || earnings.availableBalance <= 0}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet size={20} />
          Request Payout
        </button>
      </div>

      {/* Stats */}
      <StatsGrid cols={4}>
        <StatsCard
          title="Total Earnings"
          value={formatCurrency(earnings?.totalEarnings || 0)}
          icon={<TrendingUp size={24} />}
          change={{ value: 15, trend: 'up', label: 'vs last month' }}
        />
        <StatsCard
          title="Available Balance"
          value={formatCurrency(earnings?.availableBalance || 0)}
          icon={<Wallet size={24} />}
        />
        <StatsCard
          title="Pending Payouts"
          value={formatCurrency(earnings?.pendingPayouts || 0)}
          icon={<Clock size={24} />}
        />
        <StatsCard
          title="This Month"
          value={formatCurrency(earnings?.thisMonth || 0)}
          icon={<Calendar size={24} />}
          change={{ value: 8, trend: 'up', label: 'vs last month' }}
        />
      </StatsGrid>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setSelectedTab('overview')}
          className={`pb-3 px-1 font-semibold transition-colors ${
            selectedTab === 'overview'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setSelectedTab('transactions')}
          className={`pb-3 px-1 font-semibold transition-colors ${
            selectedTab === 'transactions'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setSelectedTab('payouts')}
          className={`pb-3 px-1 font-semibold transition-colors ${
            selectedTab === 'payouts'
              ? 'text-green-600 dark:text-green-400 border-b-2 border-green-600 dark:border-green-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Payouts
        </button>
      </div>

      {/* Content */}
      {selectedTab === 'overview' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Earnings Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Property Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(earnings?.fromSales || 0)}
                </p>
              </div>
              <ArrowUpRight className="text-green-500" size={32} />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Commissions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(earnings?.fromCommissions || 0)}
                </p>
              </div>
              <DollarSign className="text-blue-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'transactions' && (
        <div className="space-y-4">
          {!transactions || transactions.length === 0 ? (
            <EmptyState
              icon={<DollarSign size={48} />}
              title="No transactions yet"
              description="Your transaction history will appear here"
            />
          ) : (
            transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    transaction.type === 'CREDIT' 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'CREDIT' ? (
                      <ArrowDownRight className="text-green-600 dark:text-green-400" size={24} />
                    ) : (
                      <ArrowUpRight className="text-red-600 dark:text-red-400" size={24} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-bold ${
                    transaction.type === 'CREDIT' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedTab === 'payouts' && (
        <div className="space-y-4">
          {!payouts || payouts.length === 0 ? (
            <EmptyState
              icon={<Wallet size={48} />}
              title="No payouts yet"
              description="Request a payout to see it here"
            />
          ) : (
            payouts.map((payout: any) => (
              <div
                key={payout.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(payout.amount)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(payout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(payout.status)}`}>
                    {payout.status}
                  </span>
                </div>
                
                {payout.bankDetails && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Bank: {payout.bankDetails.bankName}</p>
                    <p>Account: ****{payout.bankDetails.accountNumber?.slice(-4)}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Request Payout
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Available Balance
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(earnings?.availableBalance || 0)}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Amount to Withdraw
              </label>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                placeholder="Enter amount"
                max={earnings?.availableBalance || 0}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPayoutModal(false)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestPayout}
                disabled={requestPayout.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {requestPayout.isPending ? 'Processing...' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
