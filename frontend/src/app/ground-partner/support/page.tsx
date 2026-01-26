'use client'

import { useState, useEffect } from 'react'
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  Headphones,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Filter,
  Calendar,
  User,
  Tag,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Shield,
  CreditCard,
  Settings,
  Smartphone,
  MapPin,
  Camera,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'payment' | 'account' | 'general' | 'app-issue'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: TicketResponse[]
  attachments: string[]
  rating?: number
}

interface TicketResponse {
  id: string
  message: string
  sender: 'user' | 'support'
  senderName: string
  timestamp: string
  attachments?: string[]
}

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

interface ContactMethod {
  type: 'phone' | 'email' | 'chat' | 'whatsapp'
  title: string
  description: string
  value: string
  availability: string
  responseTime: string
  icon: any
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [activeTab, setActiveTab] = useState('tickets')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  })
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockTickets: SupportTicket[] = [
      {
        id: 'T001',
        title: 'Payment not received for completed task',
        description: 'I completed a site visit task 3 days ago but haven\'t received payment yet. Task ID: V001',
        category: 'payment',
        priority: 'high',
        status: 'in-progress',
        createdAt: '2024-12-28T10:00:00Z',
        updatedAt: '2024-12-29T14:30:00Z',
        assignedTo: 'Support Agent - Priya',
        responses: [
          {
            id: 'R001',
            message: 'Thank you for contacting us. I can see your task was completed successfully. Let me check the payment status and get back to you within 2 hours.',
            sender: 'support',
            senderName: 'Priya - Support Agent',
            timestamp: '2024-12-28T11:30:00Z'
          },
          {
            id: 'R002',
            message: 'I\'ve checked with the finance team. Your payment is being processed and should reflect in your account within 24 hours. You\'ll receive a confirmation SMS once processed.',
            sender: 'support',
            senderName: 'Priya - Support Agent',
            timestamp: '2024-12-29T14:30:00Z'
          }
        ],
        attachments: ['task_screenshot.jpg']
      },
      {
        id: 'T002',
        title: 'App crashes when uploading photos',
        description: 'The mobile app keeps crashing whenever I try to upload photos for site visit reports. This is affecting my work.',
        category: 'technical',
        priority: 'urgent',
        status: 'resolved',
        createdAt: '2024-12-27T15:20:00Z',
        updatedAt: '2024-12-28T09:15:00Z',
        assignedTo: 'Tech Support - Rahul',
        responses: [
          {
            id: 'R003',
            message: 'We\'ve identified this issue and released a fix in version 2.1.3. Please update your app from the Play Store/App Store.',
            sender: 'support',
            senderName: 'Rahul - Tech Support',
            timestamp: '2024-12-27T16:45:00Z'
          },
          {
            id: 'R004',
            message: 'Thank you! The update fixed the issue. App is working perfectly now.',
            sender: 'user',
            senderName: 'You',
            timestamp: '2024-12-28T09:15:00Z'
          }
        ],
        attachments: [],
        rating: 5
      },
      {
        id: 'T003',
        title: 'Unable to access new task assignments',
        description: 'I\'m not receiving any new task assignments since yesterday. My profile shows active status.',
        category: 'account',
        priority: 'medium',
        status: 'open',
        createdAt: '2024-12-30T08:30:00Z',
        updatedAt: '2024-12-30T08:30:00Z',
        responses: [],
        attachments: []
      }
    ]

    const mockFaqs: FAQ[] = [
      {
        id: 'F001',
        question: 'How long does it take to receive payment after completing a task?',
        answer: 'Payments are typically processed within 24-48 hours after task completion and approval. You\'ll receive an SMS confirmation once the payment is processed. For bank transfers, it may take an additional 1-2 business days to reflect in your account.',
        category: 'Payment',
        helpful: 45,
        notHelpful: 3,
        tags: ['payment', 'timeline', 'bank transfer'],
        lastUpdated: '2024-12-15T00:00:00Z'
      },
      {
        id: 'F002',
        question: 'What should I do if I can\'t access a property for site visit?',
        answer: 'If you cannot access the property due to client unavailability or other issues: 1) Contact the client directly using provided contact details, 2) Try to reschedule within 24 hours, 3) If still unable to access, report the issue through the app with photos of your visit attempt, 4) Contact support for further assistance.',
        category: 'Site Visits',
        helpful: 38,
        notHelpful: 2,
        tags: ['site visit', 'access issues', 'client contact'],
        lastUpdated: '2024-12-10T00:00:00Z'
      },
      {
        id: 'F003',
        question: 'How do I update my bank account details for payments?',
        answer: 'To update your bank account details: 1) Go to Profile > Payment Settings, 2) Click on "Update Bank Details", 3) Enter new account information, 4) Upload a cancelled cheque or bank statement, 5) Submit for verification. Changes will be effective after verification (usually 2-3 business days).',
        category: 'Account',
        helpful: 52,
        notHelpful: 1,
        tags: ['bank account', 'payment settings', 'verification'],
        lastUpdated: '2024-12-20T00:00:00Z'
      },
      {
        id: 'F004',
        question: 'What documents do I need for property verification tasks?',
        answer: 'For property verification, you typically need: 1) Government-issued ID, 2) GharBazaar partner ID card, 3) Mobile phone with the app installed, 4) Measuring tape (for some tasks), 5) Camera for documentation. Specific requirements will be mentioned in each task description.',
        category: 'Documentation',
        helpful: 41,
        notHelpful: 4,
        tags: ['documents', 'verification', 'requirements'],
        lastUpdated: '2024-12-05T00:00:00Z'
      },
      {
        id: 'F005',
        question: 'How can I improve my partner rating?',
        answer: 'To improve your rating: 1) Complete tasks on time, 2) Provide detailed and accurate reports, 3) Upload clear photos and videos, 4) Maintain professional communication with clients, 5) Follow all safety and quality guidelines, 6) Respond quickly to task assignments, 7) Complete the feedback surveys after each task.',
        category: 'Performance',
        helpful: 67,
        notHelpful: 2,
        tags: ['rating', 'performance', 'improvement'],
        lastUpdated: '2024-12-18T00:00:00Z'
      }
    ]

    setTimeout(() => {
      setTickets(mockTickets)
      setFaqs(mockFaqs)
      setFilteredTickets(mockTickets)
      setFilteredFaqs(mockFaqs)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter tickets and FAQs
  useEffect(() => {
    let filteredT = tickets
    let filteredF = faqs

    // Search filter
    if (searchQuery) {
      filteredT = filteredT.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      filteredF = filteredF.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter for tickets
    if (filterStatus !== 'all') {
      filteredT = filteredT.filter(ticket => ticket.status === filterStatus)
    }

    // Category filter
    if (filterCategory !== 'all') {
      filteredT = filteredT.filter(ticket => ticket.category === filterCategory)
      filteredF = filteredF.filter(faq => faq.category.toLowerCase() === filterCategory)
    }

    setFilteredTickets(filteredT)
    setFilteredFaqs(filteredF)
  }, [tickets, faqs, searchQuery, filterStatus, filterCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'urgent': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Settings size={20} />
      case 'payment': return <CreditCard size={20} />
      case 'account': return <User size={20} />
      case 'app-issue': return <Smartphone size={20} />
      default: return <HelpCircle size={20} />
    }
  }

  const contactMethods: ContactMethod[] = [
    {
      type: 'phone',
      title: 'Phone Support',
      description: 'Speak directly with our support team',
      value: '+91 1800-123-4567',
      availability: '9 AM - 9 PM (Mon-Sat)',
      responseTime: 'Immediate',
      icon: Phone
    },
    {
      type: 'email',
      title: 'Email Support',
      description: 'Send us detailed queries via email',
      value: 'Gharbazaarofficial@zohomail.in',
      availability: '24/7',
      responseTime: 'Within 4 hours',
      icon: Mail
    },
    {
      type: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support agents',
      value: 'Available in app',
      availability: '9 AM - 9 PM (Mon-Sat)',
      responseTime: 'Within 5 minutes',
      icon: MessageSquare
    },
    {
      type: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Quick support via WhatsApp',
      value: '+91 98765-43210',
      availability: '9 AM - 6 PM (Mon-Fri)',
      responseTime: 'Within 30 minutes',
      icon: MessageSquare
    }
  ]

  const createTicket = async () => {
    if (!newTicket.title || !newTicket.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const ticket: SupportTicket = {
      id: `T${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      attachments: []
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' })
    setShowNewTicketModal(false)
    toast.success('Support ticket created successfully!')
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return

    const response: TicketResponse = {
      id: `R${Date.now()}`,
      message: newMessage,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString()
    }

    setTickets(prev => prev.map(ticket =>
      ticket.id === selectedTicket.id
        ? {
          ...ticket,
          responses: [...ticket.responses, response],
          updatedAt: new Date().toISOString()
        }
        : ticket
    ))

    setNewMessage('')
    toast.success('Message sent!')
  }

  const markHelpful = (faqId: string, helpful: boolean) => {
    setFaqs(prev => prev.map(faq =>
      faq.id === faqId
        ? {
          ...faq,
          helpful: helpful ? faq.helpful + 1 : faq.helpful,
          notHelpful: !helpful ? faq.notHelpful + 1 : faq.notHelpful
        }
        : faq
    ))
    toast.success(helpful ? 'Marked as helpful!' : 'Feedback recorded!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading support center...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get help and support for your ground partner activities
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <HelpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tickets.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5h</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <RefreshCw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map(method => (
            <div key={method.type} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <method.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{method.title}</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{method.description}</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{method.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{method.availability}</p>
              <p className="text-xs text-green-600 dark:text-green-400">{method.responseTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all ${activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              My Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-all ${activeTab === 'faqs'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
            >
              FAQs ({faqs.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={activeTab === 'tickets' ? 'Search tickets...' : 'Search FAQs...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {activeTab === 'tickets' && (
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="payment">Payment</option>
              <option value="account">Account</option>
              <option value="general">General</option>
              <option value="app-issue">App Issue</option>
            </select>
          </div>

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'You haven\'t created any support tickets yet'
                    }
                  </p>
                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all"
                  >
                    Create Your First Ticket
                  </button>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div key={ticket.id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedTicket(ticket)
                      setShowTicketModal(true)
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getCategoryIcon(ticket.category)}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{ticket.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">#{ticket.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)} capitalize`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {ticket.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare size={16} />
                        <span>{ticket.responses.length} responses</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No FAQs found</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search or category filter
                  </p>
                </div>
              ) : (
                filteredFaqs.map(faq => (
                  <div key={faq.id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{faq.question}</h4>
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-medium">
                        {faq.category}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {faq.answer}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {faq.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Was this helpful?
                        </span>
                        <button
                          onClick={() => markHelpful(faq.id, true)}
                          className="flex items-center space-x-1 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
                        >
                          <ThumbsUp size={16} />
                          <span className="text-sm">{faq.helpful}</span>
                        </button>
                        <button
                          onClick={() => markHelpful(faq.id, false)}
                          className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <ThumbsDown size={16} />
                          <span className="text-sm">{faq.notHelpful}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Support Ticket</h2>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="payment">Payment</option>
                    <option value="account">Account</option>
                    <option value="app-issue">App Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  Description *
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Provide detailed information about your issue..."
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={createTicket}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTicket.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ticket #{selectedTicket.id}</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Ticket Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Priority</p>
                  <p className={`font-medium capitalize ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedTicket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Conversation */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Conversation</h4>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedTicket.responses.map(response => (
                    <div key={response.id} className={`flex ${response.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${response.sender === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium opacity-80">{response.senderName}</span>
                          <span className="text-xs opacity-60">
                            {new Date(response.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply */}
              {selectedTicket.status !== 'closed' && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <div className="flex space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Rating (for resolved tickets) */}
              {selectedTicket.status === 'resolved' && !selectedTicket.rating && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Rate this support</h4>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}