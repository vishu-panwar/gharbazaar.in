'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
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
  Mail,
  Building,
  Briefcase,
  Target,
  Award,
  Zap,
  Shield,
  ThumbsUp,
  ThumbsDown,
  Reply
} from 'lucide-react'

interface Proposal {
  id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'all';
  urgency: string;
  propertyId: number | string;
  propertyTitle: string;
  location: string;
  proposalDate: string;
  responseDeadline: string;
  listedPrice: string;
  proposedPrice: string;
  sellerName: string;
  sellerRating: number;
  message: string;
  financingType: string;
  downPayment: string;
  loanAmount: string;
  inspectionDate: string;
  possessionDate: string;
  buyerProfile: any;
  conditions: any[];
  rejectionReason?: string;
  acceptedDate?: string;
}

export default function MyProposalsPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'rejected' | 'all'>('pending')
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null)

  // No proposals for now
  const proposals: Proposal[] = []


  const filteredProposals = activeTab === 'all'
    ? proposals
    : proposals.filter(proposal => proposal.status === activeTab)

  const stats = {
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
    total: proposals.length
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <div className="flex items-center space-x-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock size={12} />
            <span>Awaiting Response</span>
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

  const handleEditProposal = (proposalId: number) => {
    // Handle edit proposal logic
    console.log('Editing proposal:', proposalId)
  }

  const handleWithdrawProposal = (proposalId: number) => {
    // Handle withdraw proposal logic
    console.log('Withdrawing proposal:', proposalId)
  }

  const handleMessageSeller = (proposalId: number) => {
    // Handle message seller logic
    console.log('Messaging seller for proposal:', proposalId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="mr-3 text-blue-500" size={28} />
            My Proposals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all your property purchase proposals
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/dashboard/browse"
            className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Search size={18} />
            <span>Browse Properties</span>
          </Link>
          <Link
            href="/dashboard/browse"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg"
          >
            <Send size={20} />
            <span>Create New Proposal</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting Response</p>
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
            { key: 'pending', label: 'Awaiting Response', count: stats.pending, color: 'bg-orange-600' },
            { key: 'accepted', label: 'Accepted', count: stats.accepted, color: 'bg-green-600' },
            { key: 'rejected', label: 'Rejected', count: stats.rejected, color: 'bg-red-600' },
            { key: 'all', label: 'All Proposals', count: stats.total, color: 'bg-gray-600' }
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

      {/* Proposals List */}
      <div className="space-y-6">
        {filteredProposals.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No {activeTab !== 'all' ? activeTab : ''} proposals found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start creating proposals for properties you're interested in
            </p>
            <Link
              href="/dashboard/browse"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Search size={20} />
              <span>Browse Properties</span>
            </Link>
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 ${getStatusColor(proposal.status)} dark:border-gray-800 overflow-hidden hover:shadow-2xl transition-all`}
            >
              {/* Main Proposal Card */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Property Image */}
                  <div className="lg:w-1/4">
                    <div className="relative h-48 lg:h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={48} className="text-gray-400" />
                      </div>
                      <div className="absolute top-3 left-3">
                        {getStatusBadge(proposal.status)}
                      </div>
                      <div className="absolute top-3 right-3">
                        {getUrgencyBadge(proposal.urgency)}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                        ID: #{proposal.propertyId}
                      </div>
                    </div>
                  </div>

                  {/* Proposal Details */}
                  <div className="lg:w-3/4 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {proposal.propertyTitle}
                        </h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                          <MapPin size={14} className="mr-1" />
                          <span>{proposal.location}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span>Sent: {new Date(proposal.proposalDate).toLocaleDateString('en-IN')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>Deadline: {new Date(proposal.responseDeadline).toLocaleDateString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Listed Price</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{proposal.listedPrice}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Proposal</p>
                        <p className="text-lg font-bold text-blue-600">{proposal.proposedPrice}</p>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Savings</p>
                        <p className="text-lg font-bold text-green-600">
                          ₹{((parseFloat(proposal.listedPrice.replace(/[₹,\s]/g, '')) - parseFloat(proposal.proposedPrice.replace(/[₹,\s]/g, ''))) / 10000000).toFixed(1)}L
                        </p>
                      </div>
                    </div>

                    {/* Seller Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{proposal.sellerName}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Star className="text-yellow-500" size={14} />
                                <span className="text-sm text-gray-600">{proposal.sellerRating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">Property Owner</span>
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

                    {/* Your Message */}
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                        <MessageCircle className="mr-2 text-green-500" size={16} />
                        Your Message
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm italic">"{proposal.message}"</p>
                    </div>

                    {/* Proposal Details Toggle */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        onClick={() => setSelectedProposal(selectedProposal === proposal.id ? null : proposal.id)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-all"
                      >
                        <FileText size={16} />
                        <span>{selectedProposal === proposal.id ? 'Hide' : 'View'} Proposal Details</span>
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/browse/${proposal.propertyId}`}
                        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all"
                      >
                        <Eye size={18} />
                        <span>View Property</span>
                      </Link>

                      {proposal.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleEditProposal(proposal.id)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <Edit3 size={18} />
                            <span>Edit Proposal</span>
                          </button>
                          <button
                            onClick={() => handleMessageSeller(proposal.id)}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <MessageCircle size={18} />
                            <span>Message Seller</span>
                          </button>
                          <button
                            onClick={() => handleWithdrawProposal(proposal.id)}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                          >
                            <XCircle size={18} />
                            <span>Withdraw</span>
                          </button>
                        </>
                      )}

                      {proposal.status === 'accepted' && (
                        <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                          <ArrowUpRight size={18} />
                          <span>Proceed to Purchase</span>
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
              {selectedProposal === proposal.id && (
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
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.financingType}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Down Payment</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.downPayment}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Loan Amount</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.loanAmount}</span>
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
                            {new Date(proposal.inspectionDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Possession Date</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {new Date(proposal.possessionDate).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Your Profile */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <User className="mr-2 text-purple-500" size={20} />
                        Your Profile
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Profession</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.buyerProfile.profession}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Company</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.buyerProfile.company}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Experience</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.buyerProfile.experience}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                          <span className="text-gray-600 dark:text-gray-400">Previous Purchases</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{proposal.buyerProfile.previousPurchases}</span>
                        </div>
                      </div>
                    </div>

                    {/* Conditions */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                        <Shield className="mr-2 text-orange-500" size={20} />
                        Proposal Conditions
                      </h4>
                      <div className="space-y-2">
                        {proposal.conditions.map((condition: string, index: number) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-white dark:bg-gray-800 rounded-lg">
                            <CheckCircle className="text-green-500 mt-0.5" size={16} />
                            <span className="text-gray-700 dark:text-gray-300 text-sm">{condition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {proposal.status === 'rejected' && proposal.rejectionReason && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <h5 className="font-semibold text-red-800 dark:text-red-400 mb-2 flex items-center">
                        <XCircle className="mr-2" size={16} />
                        Rejection Reason
                      </h5>
                      <p className="text-red-700 dark:text-red-300 text-sm">{proposal.rejectionReason}</p>
                    </div>
                  )}

                  {/* Acceptance Details */}
                  {proposal.status === 'accepted' && proposal.acceptedDate && (
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h5 className="font-semibold text-green-800 dark:text-green-400 mb-2 flex items-center">
                        <CheckCircle className="mr-2" size={16} />
                        Proposal Accepted
                      </h5>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Accepted on {new Date(proposal.acceptedDate).toLocaleDateString('en-IN', {
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