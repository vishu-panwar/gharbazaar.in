'use client'

import { useState, useEffect } from 'react'
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Send,
  Paperclip,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Globe,
  Smartphone,
  Zap,
  Shield,
  Award,
  Target,
  TrendingUp,
  Users,
  Building,
  Home,
  MapPin,
  IndianRupee,
  CreditCard,
  Settings,
  Bell,
  Eye,
  Download,
  Share2,
  Copy,
  RefreshCw,
  Plus,
  Minus,
  X,
  Filter,
  Tag,
  Flag,
  Lightbulb,
  Info,
  Bookmark,
  Heart,
  Sparkles,
  Crown,
  Gift,
  Briefcase,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
  notHelpful: number
  tags: string[]
  lastUpdated: string
}

interface SupportTicket {
  id: string
  subject: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  messages: TicketMessage[]
}

interface TicketMessage {
  id: string
  sender: 'user' | 'support'
  message: string
  timestamp: string
  attachments?: string[]
}

interface ContactInfo {
  phone: string
  email: string
  whatsapp: string
  hours: string
  responseTime: string
}

export default function SupportPage() {
  const [user, setUser] = useState<any>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('faq')
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  })

  const contactInfo: ContactInfo = {
    phone: '+91 1800-123-4567',
    email: 'Gharbazaarofficial@zohomail.in',
    whatsapp: '+91 98765-43210',
    hours: '9:00 AM - 9:00 PM (Mon-Sat)',
    responseTime: 'Within 2 hours'
  }

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock FAQ data
    const mockFaqs: FAQ[] = [
      {
        id: 'FAQ001',
        question: 'How do I get paid for my referrals?',
        answer: 'You get paid when your referred customer successfully completes a property transaction. Commission is calculated based on the property value and your partner tier. Payments are processed within 24-48 hours after deal closure and are transferred directly to your registered bank account or UPI.',
        category: 'payments',
        helpful: 45,
        notHelpful: 2,
        tags: ['commission', 'payment', 'referral'],
        lastUpdated: '2024-12-15T00:00:00Z'
      },
      {
        id: 'FAQ002',
        question: 'What commission rates do I earn?',
        answer: 'Commission rates vary based on property type and your partner tier: Starter (1.5-2%), Silver (2-2.5%), Gold (2.5-3%), Platinum (3-3.5%). Luxury properties and commercial deals may have higher rates. You can view your current tier and rates in the earnings section.',
        category: 'earnings',
        helpful: 38,
        notHelpful: 1,
        tags: ['commission', 'rates', 'tiers'],
        lastUpdated: '2024-12-10T00:00:00Z'
      },
      {
        id: 'FAQ003',
        question: 'How do I track my referrals?',
        answer: 'Use the Lead Tracking page to monitor all your referrals. You can see real-time status updates, customer communication history, and expected commission amounts. Each referral gets a unique ID for easy tracking.',
        category: 'leads',
        helpful: 52,
        notHelpful: 0,
        tags: ['tracking', 'leads', 'referrals'],
        lastUpdated: '2024-12-20T00:00:00Z'
      },
      {
        id: 'FAQ004',
        question: 'What should I tell potential customers?',
        answer: 'Focus on GharBazaar\'s key benefits: zero brokerage for buyers, RERA-verified properties, free legal support, and transparent pricing. Avoid making promises about specific properties or guaranteed deals. Always direct them to our platform for detailed information.',
        category: 'sales',
        helpful: 67,
        notHelpful: 3,
        tags: ['communication', 'customers', 'sales'],
        lastUpdated: '2024-12-18T00:00:00Z'
      },
      {
        id: 'FAQ005',
        question: 'Can I refer both buyers and sellers?',
        answer: 'Yes! You can refer both property buyers and sellers. Seller referrals typically have higher commission rates. Make sure to specify the type when submitting referrals for accurate commission calculation.',
        category: 'referrals',
        helpful: 29,
        notHelpful: 1,
        tags: ['buyers', 'sellers', 'referrals'],
        lastUpdated: '2024-12-12T00:00:00Z'
      },
      {
        id: 'FAQ006',
        question: 'How do I withdraw my earnings?',
        answer: 'Go to Payment History > Withdraw Money. Choose between bank transfer (₹25 fee) or UPI (₹15 fee). Minimum withdrawal is ₹1,000. Provide accurate bank/UPI details. Withdrawals are processed within 24-48 hours on business days.',
        category: 'payments',
        helpful: 41,
        notHelpful: 2,
        tags: ['withdrawal', 'bank', 'UPI'],
        lastUpdated: '2024-12-22T00:00:00Z'
      },
      {
        id: 'FAQ007',
        question: 'What are the legal compliance requirements?',
        answer: 'As a partner, you act only as a referral source, not a broker. You cannot negotiate deals, collect payments, or make legal commitments. Always direct customers to GharBazaar for official transactions. Complete the legal compliance training module for detailed guidelines.',
        category: 'legal',
        helpful: 33,
        notHelpful: 0,
        tags: ['legal', 'compliance', 'RERA'],
        lastUpdated: '2024-12-08T00:00:00Z'
      },
      {
        id: 'FAQ008',
        question: 'How do I improve my conversion rate?',
        answer: 'Focus on quality over quantity: pre-qualify leads, understand customer needs, follow up promptly, and use our training materials. Share success stories and use platform-specific content templates. Track your performance metrics to identify improvement areas.',
        category: 'performance',
        helpful: 56,
        notHelpful: 1,
        tags: ['conversion', 'performance', 'tips'],
        lastUpdated: '2024-12-25T00:00:00Z'
      }
    ]

    const mockTickets: SupportTicket[] = [
      {
        id: 'TKT001',
        subject: 'Commission payment delay for lead LD002',
        description: 'My commission for lead LD002 (Amit Sharma apartment purchase) was supposed to be paid 3 days ago but I haven\'t received it yet.',
        category: 'payments',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2024-12-27T10:30:00Z',
        updatedAt: '2024-12-28T14:20:00Z',
        assignedTo: 'Support Team',
        messages: [
          {
            id: 'MSG001',
            sender: 'user',
            message: 'My commission for lead LD002 (Amit Sharma apartment purchase) was supposed to be paid 3 days ago but I haven\'t received it yet.',
            timestamp: '2024-12-27T10:30:00Z'
          },
          {
            id: 'MSG002',
            sender: 'support',
            message: 'Thank you for contacting us. We\'re checking the payment status for lead LD002. Our finance team is reviewing the documentation. We\'ll update you within 24 hours.',
            timestamp: '2024-12-27T15:45:00Z'
          },
          {
            id: 'MSG003',
            sender: 'support',
            message: 'Update: The payment was held due to pending document verification from the customer. The documents have now been verified and payment will be processed today. You should receive it within 24 hours.',
            timestamp: '2024-12-28T14:20:00Z'
          }
        ]
      },
      {
        id: 'TKT002',
        subject: 'Unable to access training modules',
        description: 'I\'m getting an error when trying to access the "Legal Compliance & RERA Guidelines" training module.',
        category: 'technical',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2024-12-25T09:15:00Z',
        updatedAt: '2024-12-25T16:30:00Z',
        assignedTo: 'Tech Support',
        messages: [
          {
            id: 'MSG004',
            sender: 'user',
            message: 'I\'m getting an error when trying to access the "Legal Compliance & RERA Guidelines" training module.',
            timestamp: '2024-12-25T09:15:00Z'
          },
          {
            id: 'MSG005',
            sender: 'support',
            message: 'We\'ve identified the issue with the training module. Our technical team is working on a fix. We\'ll notify you once it\'s resolved.',
            timestamp: '2024-12-25T11:30:00Z'
          },
          {
            id: 'MSG006',
            sender: 'support',
            message: 'The issue has been resolved. You should now be able to access all training modules. Please try again and let us know if you face any issues.',
            timestamp: '2024-12-25T16:30:00Z'
          }
        ]
      }
    ]

    setTimeout(() => {
      setFaqs(mockFaqs)
      setFilteredFaqs(mockFaqs)
      setTickets(mockTickets)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter FAQs
  useEffect(() => {
    let filtered = faqs.filter(faq => {
      const searchMatch = !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const categoryMatch = selectedCategory === 'all' || faq.category === selectedCategory

      return searchMatch && categoryMatch
    })

    setFilteredFaqs(filtered)
  }, [faqs, searchQuery, selectedCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      case 'in-progress': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'resolved': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'closed': return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />
      case 'in-progress': return <RefreshCw className="w-4 h-4" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <X className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCreateTicket = () => {
    // In a real app, this would make an API call
    toast.success('Support ticket created successfully!')
    setShowNewTicketModal(false)
    setNewTicket({
      subject: '',
      description: '',
      category: 'general',
      priority: 'medium'
    })
  }

  const markHelpful = (faqId: string, helpful: boolean) => {
    toast.success(helpful ? 'Marked as helpful!' : 'Feedback recorded!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading support center...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Support Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Get help, find answers, and connect with our support team
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="w-8 h-8" />
            <span className="text-green-100 text-sm font-medium">Most Popular</span>
          </div>
          <h3 className="text-xl font-bold mb-2">WhatsApp Support</h3>
          <p className="text-green-100 mb-4">Quick responses for urgent queries</p>
          <p className="text-sm text-green-100 mb-4">{contactInfo.responseTime}</p>
          <button className="w-full bg-white text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all">
            Chat on WhatsApp
          </button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Phone className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Call Us</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Phone Support</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Speak directly with our team</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{contactInfo.hours}</p>
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
            {contactInfo.phone}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">Email Us</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Email Support</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Detailed support via email</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Response within 4 hours</p>
          <button className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all">
            Send Email
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'faq'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          <HelpCircle size={20} />
          <span>FAQ</span>
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'tickets'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          <MessageSquare size={20} />
          <span>My Tickets</span>
          {tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length > 0 && (
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'resources'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          <BookOpen size={20} />
          <span>Resources</span>
        </button>
      </div>

      {/* FAQ Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="payments">Payments</option>
              <option value="earnings">Earnings</option>
              <option value="leads">Leads</option>
              <option value="sales">Sales</option>
              <option value="referrals">Referrals</option>
              <option value="legal">Legal</option>
              <option value="performance">Performance</option>
              <option value="technical">Technical</option>
            </select>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {faq.question}
                      </h3>
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-medium capitalize">
                          {faq.category}
                        </span>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{faq.helpful}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedFaq === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="pt-4">
                      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                        {faq.answer}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {faq.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">Was this helpful?</span>
                          <button
                            onClick={() => markHelpful(faq.id, true)}
                            className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-all"
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => markHelpful(faq.id, false)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or browse different categories
              </p>
              <button
                onClick={() => setActiveTab('tickets')}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Create Support Ticket</span>
              </button>
            </div>
          )}
        </div>
      )}
      {/* Tickets Tab */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Support Tickets</h2>
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Ticket</span>
            </button>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ticket.subject}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        #{ticket.id}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        Created {formatDate(ticket.createdAt)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs capitalize">
                        {ticket.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusIcon(ticket.status)}
                      <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {ticket.messages.length} messages
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No support tickets
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first support ticket to get help from our team
              </p>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
              >
                <Plus className="w-5 h-5" />
                <span>Create Ticket</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Helpful Resources
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Guides, tutorials, and documentation to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Partner Handbook
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Complete guide to being a successful GharBazaar partner
              </p>
              <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline">
                <span>Download PDF</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Training Videos
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Watch video tutorials on sales techniques and best practices
              </p>
              <button className="flex items-center space-x-2 text-green-600 dark:text-green-400 hover:underline">
                <span>Watch Now</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Partner Community
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Connect with other partners and share experiences
              </p>
              <button className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline">
                <span>Join Community</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Legal Guidelines
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                RERA compliance and legal requirements for partners
              </p>
              <button className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 hover:underline">
                <span>Read Guidelines</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Marketing Materials
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Download banners, flyers, and social media content
              </p>
              <button className="flex items-center space-x-2 text-red-600 dark:text-red-400 hover:underline">
                <span>Download Assets</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Success Tips
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Learn from top-performing partners and industry experts
              </p>
              <button className="flex items-center space-x-2 text-yellow-600 dark:text-yellow-400 hover:underline">
                <span>Read Tips</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Support Ticket
              </h2>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      <option value="payments">Payments</option>
                      <option value="technical">Technical</option>
                      <option value="leads">Leads</option>
                      <option value="training">Training</option>
                      <option value="legal">Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Provide detailed information about your issue..."
                    rows={6}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Tips for faster resolution:
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Include specific error messages or screenshots</li>
                        <li>• Mention relevant lead IDs or transaction numbers</li>
                        <li>• Describe steps you've already tried</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTicket}
                    disabled={!newTicket.subject || !newTicket.description}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Create Ticket</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedTicket.subject}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Ticket #{selectedTicket.id}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Ticket Info */}
              <div className="w-80 border-r border-gray-200 dark:border-gray-800 p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                      <span className="capitalize">{selectedTicket.status.replace('-', ' ')}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTicket.priority)}`}></div>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">{selectedTicket.priority}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</h3>
                    <span className="text-sm text-gray-900 dark:text-white capitalize">{selectedTicket.category}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Created</h3>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(selectedTicket.createdAt)}</span>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Updated</h3>
                    <span className="text-sm text-gray-900 dark:text-white">{formatDate(selectedTicket.updatedAt)}</span>
                  </div>

                  {selectedTicket.assignedTo && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assigned To</h3>
                      <span className="text-sm text-gray-900 dark:text-white">{selectedTicket.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {selectedTicket.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}>
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}