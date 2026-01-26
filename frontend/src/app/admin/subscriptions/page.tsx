'use client'

import { useState } from 'react'
import {
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  AlertCircle,
  RefreshCw,
  Crown,
  Zap,
  Star,
  Award,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SubscriptionManagementPage() {
  const [filter, setFilter] = useState('all')
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  const subscriptions = [
    {
      id: 1,
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      plan: 'Premium',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      amount: 2999,
      billingCycle: 'monthly',
      autoRenew: true,
      daysLeft: 12,
      listingsUsed: 8,
      listingsLimit: 10,
      avatar: 'RK',
    },
    {
      id: 2,
      userId: 'USR002',
      userName: 'Priya Sharma',
      email: 'priya@example.com',
      plan: 'Basic',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      amount: 999,
      billingCycle: 'monthly',
      autoRenew: true,
      daysLeft: 27,
      listingsUsed: 2,
      listingsLimit: 3,
      avatar: 'PS',
    },
    {
      id: 3,
      userId: 'USR003',
      userName: 'Amit Patel',
      email: 'amit@example.com',
      plan: 'Enterprise',
      status: 'active',
      startDate: '2024-01-10',
      endDate: '2025-01-10',
      amount: 99999,
      billingCycle: 'yearly',
      autoRenew: true,
      daysLeft: 355,
      listingsUsed: 45,
      listingsLimit: -1,
      avatar: 'AP',
    },
    {
      id: 4,
      userId: 'USR004',
      userName: 'Sneha Reddy',
      email: 'sneha@example.com',
      plan: 'Premium',
      status: 'expiring',
      startDate: '2023-12-20',
      endDate: '2024-01-20',
      amount: 2999,
      billingCycle: 'monthly',
      autoRenew: false,
      daysLeft: 1,
      listingsUsed: 10,
      listingsLimit: 10,
      avatar: 'SR',
    },
    {
      id: 5,
      userId: 'USR005',
      userName: 'Vikram Singh',
      email: 'vikram@example.com',
      plan: 'Basic',
      status: 'expired',
      startDate: '2023-12-01',
      endDate: '2024-01-01',
      amount: 999,
      billingCycle: 'monthly',
      autoRenew: false,
      daysLeft: -18,
      listingsUsed: 3,
      listingsLimit: 3,
      avatar: 'VS',
    },
    {
      id: 6,
      userId: 'USR006',
      userName: 'Kavita Desai',
      email: 'kavita@example.com',
      plan: 'Premium',
      status: 'cancelled',
      startDate: '2023-11-15',
      endDate: '2024-01-15',
      amount: 2999,
      billingCycle: 'monthly',
      autoRenew: false,
      daysLeft: -4,
      listingsUsed: 5,
      listingsLimit: 10,
      avatar: 'KD',
    },
  ]

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 999,
      billingCycle: 'monthly',
      features: ['3 Property Listings', 'Basic Support', 'Standard Analytics', '30-day History'],
      subscribers: 245,
      revenue: 244755,
      color: 'blue',
      icon: Package,
    },
    {
      id: 2,
      name: 'Premium',
      price: 2999,
      billingCycle: 'monthly',
      features: [
        '10 Property Listings',
        'Priority Support',
        'Advanced Analytics',
        'Featured Listings',
        '90-day History',
      ],
      subscribers: 189,
      revenue: 566811,
      color: 'purple',
      icon: Crown,
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 99999,
      billingCycle: 'yearly',
      features: [
        'Unlimited Listings',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'API Access',
        'White Label',
        'Unlimited History',
      ],
      subscribers: 23,
      revenue: 2299977,
      color: 'orange',
      icon: Award,
    },
  ]

  const stats = {
    totalSubscribers: 457,
    activeSubscriptions: 389,
    expiringSubscriptions: 34,
    monthlyRevenue: 1245678,
    revenueGrowth: 15.3,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'expiring':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'expired':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'basic':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'premium':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'enterprise':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleViewDetails = (subscription: any) => {
    setSelectedSubscription(subscription)
    setShowModal(true)
  }

  const handleCancelSubscription = (id: number) => {
    toast.success('Subscription cancelled successfully')
  }

  const handleRenewSubscription = (id: number) => {
    toast.success('Subscription renewed successfully')
  }

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan)
    setShowPlanModal(true)
  }

  const filteredSubscriptions = subscriptions.filter((sub) =>
    filter === 'all' ? true : sub.status === filter
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Subscription Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage plans and subscriptions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.totalSubscribers}</p>
          <p className="text-sm opacity-80">Total Subscribers</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.activeSubscriptions}</p>
          <p className="text-sm opacity-80">Active</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.expiringSubscriptions}</p>
          <p className="text-sm opacity-80">Expiring Soon</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <TrendingUp size={16} />
              <span>{stats.revenueGrowth}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{(stats.monthlyRevenue / 100000).toFixed(2)}L
          </p>
          <p className="text-sm opacity-80">Monthly Recurring Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    plan.color === 'blue'
                      ? 'bg-blue-100 dark:bg-blue-900/30'
                      : plan.color === 'purple'
                        ? 'bg-purple-100 dark:bg-purple-900/30'
                        : 'bg-orange-100 dark:bg-orange-900/30'
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      plan.color === 'blue'
                        ? 'text-blue-600'
                        : plan.color === 'purple'
                          ? 'text-purple-600'
                          : 'text-orange-600'
                    }
                  />
                </div>
                <button
                  onClick={() => handleEditPlan(plan)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                >
                  <Edit size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-3xl font-bold text-purple-600">₹{plan.price}</span>
                <span className="text-gray-500">/{plan.billingCycle}</span>
              </div>

              <div className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Subscribers</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {plan.subscribers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                  <span className="font-bold text-green-600">
                    ₹{(plan.revenue / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by user name or email..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'active', 'expiring', 'expired', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {subscription.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {subscription.userName}
                  </h3>
                  <p className="text-sm text-gray-500">{subscription.userId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPlanColor(subscription.plan)}`}>
                  {subscription.plan} Plan
                </span>
                <span className="text-lg font-bold text-purple-600">
                  ₹{subscription.amount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Billing Cycle</span>
                  <span className="font-medium capitalize">{subscription.billingCycle}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Auto Renew</span>
                  <span className="font-medium">
                    {subscription.autoRenew ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                  <span>Days Left</span>
                  <span
                    className={`font-bold ${
                      subscription.daysLeft < 0
                        ? 'text-red-600'
                        : subscription.daysLeft < 7
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {subscription.daysLeft < 0 ? 'Expired' : `${subscription.daysLeft} days`}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Listings Used</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {subscription.listingsUsed} /{' '}
                  {subscription.listingsLimit === -1 ? '∞' : subscription.listingsLimit}
                </span>
              </div>
              {subscription.listingsLimit !== -1 && (
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (subscription.listingsUsed / subscription.listingsLimit) * 100 >= 90
                        ? 'bg-red-500'
                        : (subscription.listingsUsed / subscription.listingsLimit) * 100 >= 70
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{
                      width: `${Math.min((subscription.listingsUsed / subscription.listingsLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewDetails(subscription)}
                className="flex-1 flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-all"
              >
                <Eye size={16} />
                <span>View</span>
              </button>
              {subscription.status === 'active' && (
                <button
                  onClick={() => handleCancelSubscription(subscription.id)}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                  title="Cancel Subscription"
                >
                  <XCircle size={16} />
                </button>
              )}
              {(subscription.status === 'expired' || subscription.status === 'expiring') && (
                <button
                  onClick={() => handleRenewSubscription(subscription.id)}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all"
                  title="Renew Subscription"
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">Subscription Details</h2>
                  <p className="text-purple-100">{selectedSubscription.userName}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getPlanColor(selectedSubscription.plan)}`}>
                      {selectedSubscription.plan} Plan
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedSubscription.status)}`}>
                      {selectedSubscription.status}
                    </span>
                  </div>
                  <p className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                    ₹{selectedSubscription.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600 dark:text-purple-400 capitalize">
                    {selectedSubscription.billingCycle} Billing
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar size={18} />
                    <p className="text-sm font-medium">Start Date</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubscription.startDate}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar size={18} />
                    <p className="text-sm font-medium">End Date</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubscription.endDate}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <RefreshCw size={18} />
                    <p className="text-sm font-medium">Auto Renew</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Clock size={18} />
                    <p className="text-sm font-medium">Days Remaining</p>
                  </div>
                  <p
                    className={`font-bold text-xl ${
                      selectedSubscription.daysLeft < 0
                        ? 'text-red-600'
                        : selectedSubscription.daysLeft < 7
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {selectedSubscription.daysLeft < 0
                      ? 'Expired'
                      : `${selectedSubscription.daysLeft} days`}
                  </p>
                </div>

                <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Package size={18} />
                      <p className="text-sm font-medium">Listings Usage</p>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedSubscription.listingsUsed} /{' '}
                      {selectedSubscription.listingsLimit === -1
                        ? 'Unlimited'
                        : selectedSubscription.listingsLimit}
                    </span>
                  </div>
                  {selectedSubscription.listingsLimit !== -1 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          (selectedSubscription.listingsUsed / selectedSubscription.listingsLimit) *
                            100 >=
                          90
                            ? 'bg-red-500'
                            : (selectedSubscription.listingsUsed /
                                  selectedSubscription.listingsLimit) *
                                100 >=
                                70
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min((selectedSubscription.listingsUsed / selectedSubscription.listingsLimit) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                {selectedSubscription.status === 'active' && (
                  <button
                    onClick={() => {
                      handleCancelSubscription(selectedSubscription.id)
                      setShowModal(false)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <XCircle size={20} />
                    <span>Cancel Subscription</span>
                  </button>
                )}
                {(selectedSubscription.status === 'expired' ||
                  selectedSubscription.status === 'expiring') && (
                  <button
                    onClick={() => {
                      handleRenewSubscription(selectedSubscription.id)
                      setShowModal(false)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <RefreshCw size={20} />
                    <span>Renew Subscription</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <h2 className="text-2xl font-bold">Edit {selectedPlan.name} Plan</h2>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Plan Name</label>
                <input
                  type="text"
                  defaultValue={selectedPlan.name}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹)</label>
                  <input
                    type="number"
                    defaultValue={selectedPlan.price}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Billing Cycle</label>
                  <select
                    defaultValue={selectedPlan.billingCycle}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Features</label>
                <div className="space-y-2">
                  {selectedPlan.features.map((feature: string, index: number) => (
                    <input
                      key={index}
                      type="text"
                      defaultValue={feature}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    toast.success('Plan updated successfully')
                    setShowPlanModal(false)
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
