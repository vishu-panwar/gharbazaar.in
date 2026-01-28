'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  MessageCircle,
  ArrowUpRight,
  Filter,
  Search,
  Send,
  Edit3,
  Download,
  Star,
  User,
  Phone,
  Building,
  Briefcase,
  Target,
  Award,
  Zap,
  Shield,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Reply
} from 'lucide-react'

interface OfferLetter {
  id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'all';
  urgency: string;
  propertyId: number | string;
  propertyTitle: string;
  location: string;
  offerDate: string;
  responseDeadline: string;
  listedPrice: string;
  offeredPrice: string;
  buyerName: string;
  buyerRating: number;
  buyerProfile: any;
  message: string;
  financingType: string;
  downPayment: string;
  loanAmount: string;
  inspectionDate: string;
  possessionDate: string;
  conditions: any[];
  rejectionReason?: string;
  acceptedDate?: string;
}

export default function OfferLettersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected' | 'all'>('pending')
  const [selectedOffer, setSelectedOffer] = useState<number | null>(null)

  // No offer letters for now
  const offerLetters: OfferLetter[] = []


  const filteredOffers = activeTab === 'all'
    ? offerLetters
    : offerLetters.filter(offer => offer.status === activeTab)

  const stats = {
    pending: offerLetters.filter(o => o.status === 'pending').length,
    accepted: offerLetters.filter(o => o.status === 'accepted').length,
    rejected: offerLetters.filter(o => o.status === 'rejected').length,
    total: offerLetters.length
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock size={12} />
            <span>Pending Response</span>
          </div>
        )
      case 'accepted':
        return (
          <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle size={12} />
            <span>Accepted</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
            <XCircle size={12} />
            <span>Rejected</span>
          </div>
        )
      default:
        return null
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return (
          <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded text-xs font-medium">
            <AlertCircle size={10} />
            <span>Urgent</span>
          </div>
        )
      case 'medium':
        return (
          <div className="flex items-center space-x-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded text-xs font-medium">
            <Clock size={10} />
            <span>Medium</span>
          </div>
        )
      case 'low':
        return (
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded text-xs font-medium">
            <Clock size={10} />
            <span>Low</span>
          </div>
        )
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'border-orange-500'
      case 'accepted': return 'border-green-500'
      case 'rejected': return 'border-red-500'
      default: return 'border-gray-200'
    }
  }

  const handleAcceptOffer = (offerId: number) => {
    // Handle accept offer logic
    console.log('Accepting offer:', offerId)
  }

  const handleRejectOffer = (offerId: number) => {
    // Handle reject offer logic
    console.log('Rejecting offer:', offerId)
  }

  const handleCounterOffer = (offerId: number) => {
    // Handle counter offer logic
    console.log('Making counter offer:', offerId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Mail className="mr-3 text-green-500" size={28} />
            Offer Letters
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage purchase offers from potential buyers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/listings"
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Home size={18} />
            <span>My Listings</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            <TrendingUp size={20} />
            <span>View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Mail className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Offers</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending Response</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.accepted}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accepted</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="text-red-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rejected</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-2">
        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'pending', label: 'Pending Response', count: stats.pending, color: 'bg-orange-600' },
            { key: 'accepted', label: 'Accepted', count: stats.accepted, color: 'bg-green-600' },
            { key: 'rejected', label: 'Rejected', count: stats.rejected, color: 'bg-red-600' },
            { key: 'all', label: 'All Offers', count: stats.total, color: 'bg-gray-600' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[120px] px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.key
                ? `${tab.color} text-white shadow-lg`
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Offer Letters List */}
      <div className="space-y-6">
        {filteredOffers.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Mail size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No {activeTab !== 'all' ? activeTab : ''} offers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Buyers will send offers for your listed properties
            </p>
            <Link
              href="/dashboard/listings"
              className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Home size={20} />
              <span>View My Listings</span>
            </Link>
          </div>
        ) : (
          filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 ${getStatusColor(offer.status)} dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all`}
            >
              {/* Main Offer Card */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="lg:w-1/4">
                    <div className="relative h-48 lg:h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={48} className="text-gray-400" />
                      </div>
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(offer.status)}
                      </div>
                      <div className="absolute top-3 right-3">
                        {getUrgencyBadge(offer.urgency)}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                        ID: #{offer.propertyId}
                      </div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="lg:w-3/4 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {offer.propertyTitle}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <MapPin size={14} className="mr-1" />
                          <span>{offer.location}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>Received: {new Date(offer.offerDate).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>Deadline: {new Date(offer.responseDeadline).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Listed Price</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{offer.listedPrice}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Buyer's Offer</p>
                        <p className="text-lg font-bold text-blue-600">{offer.offeredPrice}</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Difference</p>
                        <p className="text-lg font-bold text-red-600">
                          -₹{((parseFloat(offer.listedPrice.replace(/[₹,\s]/g, '')) - parseFloat(offer.offeredPrice.replace(/[₹,\s]/g, ''))) / 10000000).toFixed(1)}L
                        </p>
                      </div>
                    </div>

                    {/* Buyer Information */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{offer.buyerName}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="text-yellow-500" size={14} />
                                <span className="text-sm text-gray-600">{offer.buyerRating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{offer.buyerProfile.profession}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            <Phone size={16} className="text-gray-600" />
                          </button>
                          <button className="p-2 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                            <Mail size={16} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Message */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <MessageCircle className="mr-2 text-blue-500" size={16} />
                        Buyer's Message
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{offer.message}"</p>
                    </div>

                    {/* Offer Details Toggle */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        onClick={() => setSelectedOffer(selectedOffer === offer.id ? null : offer.id)}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-all"
                      >
                        <FileText size={16} />
                        <span>{selectedOffer === offer.id ? 'Hide' : 'View'} Offer Details</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/listings/${offer.propertyId}`}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <Eye size={18} />
                        <span>View Property</span>
                      </Link>

                      {offer.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptOffer(offer.id)}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <ThumbsUp size={18} />
                            <span>Accept Offer</span>
                          </button>
                          <button
                            onClick={() => handleCounterOffer(offer.id)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <Reply size={18} />
                            <span>Counter Offer</span>
                          </button>
                          <button
                            onClick={() => handleRejectOffer(offer.id)}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <ThumbsDown size={18} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {offer.status === 'accepted' && (
                        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                          <ArrowUpRight size={18} />
                          <span>Proceed to Sale</span>
                        </button>
                      )}

                      <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                        <Download size={18} />
                        <span>Download PDF</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOffer === offer.id && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Details */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <DollarSign className="mr-2 text-green-500" size={20} />
                        Financial Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Financing Type</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.financingType}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Down Payment</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.downPayment}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.loanAmount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Calendar className="mr-2 text-blue-500" size={20} />
                        Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Inspection Date</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(offer.inspectionDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Possession Date</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(offer.possessionDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Buyer Profile */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <User className="mr-2 text-purple-500" size={20} />
                        Buyer Profile
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Profession</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.buyerProfile.profession}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Company</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.buyerProfile.company}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Experience</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.buyerProfile.experience}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Previous Purchases</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{offer.buyerProfile.previousPurchases}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Shield className="mr-2 text-orange-500" size={20} />
                        Offer Conditions
                      </h4>
                      <div className="space-y-2">
                        {offer.conditions.map((condition: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="text-green-500 mt-0.5" size={16} />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {offer.status === 'rejected' && offer.rejectionReason && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <h5 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center">
                        <XCircle className="mr-2" size={16} />
                        Rejection Reason
                      </h5>
                      <p className="text-red-700 dark:text-red-300 text-sm">{offer.rejectionReason}</p>
                    </div>
                  )}

                  {/* Acceptance Details */}
                  {offer.status === 'accepted' && offer.acceptedDate && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center">
                        <CheckCircle className="mr-2" size={16} />
                        Offer Accepted
                      </h5>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Accepted on {new Date(offer.acceptedDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}