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
  XCircle,
  User,
  Calendar,
  Tag,
  Filter,
  Eye,
  Edit,
  Trash2,
  Send,
  Paperclip,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  ExternalLink,
  Download,
  RefreshCw,
  Bell,
  Shield,
  Zap,
  BookOpen,
  Video,
  FileText,
  Headphones,
  X,
  ChevronDown,
  ChevronRight,
  Info,
  AlertTriangle,
  Lightbulb,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Wifi,
  Database,
  Lock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SupportTicket {
  id: string
  title: string
  description: string
  category: 'technical' | 'account' | 'billing' | 'legal' | 'feature-request' | 'bug-report' | 'general'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'open' | 'in-progress' | 'waiting-response' | 'resolved' | 'closed'
  createdDate: string
  lastUpdated: string
  assignedTo?: string
  responses: TicketResponse[]
  attachments: string[]
  tags: string[]
  rating?: number
  feedback?: string
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
  label: string
  value: string
  availability: string
  responseTime: string
  icon: any
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [activeTab, setActiveTab] = useState('tickets')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium'
  })
  const [newResponse, setNewResponse] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const contactMethods: ContactMethod[] = [
    {
      type: 'phone',
      label: 'Phone Support',
      value: '+91 1800-123-4567',
      availability: '24/7 Available',
      responseTime: 'Immediate',
      icon: Phone
    },
    {
      type: 'email',
      label: 'Email Support',
      value: 'Gharbazaarofficial@zohomail.in',
      availability: 'Mon-Sat, 9 AM - 6 PM',
      responseTime: 'Within 4 hours',
      icon: Mail
    },
    {
      type: 'chat',
      label: 'Live Chat',
      value: 'Start Chat',
      availability: 'Mon-Fri, 9 AM - 9 PM',
      responseTime: 'Within 5 minutes',
      icon: MessageSquare
    },
    {
      type: 'whatsapp',
      label: 'WhatsApp Support',
      value: '+91 98765-43210',
      availability: '24/7 Available',
      responseTime: 'Within 30 minutes',
      icon: Smartphone
    }
  ]

  // Mock data
  useEffect(() => {
    const mockTickets: SupportTicket[] = [
      {
        id: 'ST001',
        title: 'Unable to upload documents in case LC001',
        description: 'I am facing issues while trying to upload PDF documents for case LC001. The upload fails with an error message.',
        category: 'technical',
        priority: 'high',
        status: 'in-progress',
        createdDate: '2024-12-30T10:00:00Z',
        lastUpdated: '2024-12-31T14:30:00Z',
        assignedTo: 'Technical Support Team',
        responses: [
          {
            id: 'R001',
            message: 'Thank you for reporting this issue. We are investigating the document upload problem. Can you please share the file size and format you are trying to upload?',
            sender: 'support',
            senderName: 'Tech Support',
            timestamp: '2024-12-30T11:30:00Z'
          },
          {
            id: 'R002',
            message: 'The file is a PDF, approximately 5MB in size. I have tried multiple times but it keeps failing at 80% upload progress.',
            sender: 'user',
            senderName: 'Advocate Rajesh Kumar',
            timestamp: '2024-12-30T14:15:00Z'
          },
          {
            id: 'R003',
            message: 'We have identified the issue and deployed a fix. Please try uploading again. The issue was related to large file handling on our servers.',
            sender: 'support',
            senderName: 'Tech Support',
            timestamp: '2024-12-31T14:30:00Z'
          }
        ],
        attachments: ['error-screenshot.png'],
        tags: ['upload', 'documents', 'pdf', 'case-management']
      },
      {
        id: 'ST002',
        title: 'Payment not reflected in earnings',
        description: 'My payment for case LC002 was processed 3 days ago but is not showing in my earnings dashboard.',
        category: 'billing',
        priority: 'medium',
        status: 'resolved',
        createdDate: '2024-12-28T09:00:00Z',
        lastUpdated: '2024-12-29T16:45:00Z',
        assignedTo: 'Billing Team',
        responses: [
          {
            id: 'R004',
            message: 'We have checked your payment records. The payment was processed successfully and should reflect in your dashboard within 24 hours. We are updating the system now.',
            sender: 'support',
            senderName: 'Billing Support',
            timestamp: '2024-12-29T16:45:00Z'
          }
        ],
        attachments: [],
        tags: ['payment', 'earnings', 'billing'],
        rating: 5,
        feedback: 'Quick resolution, very helpful!'
      },
      {
        id: 'ST003',
        title: 'Request for RERA compliance training',
        description: 'I would like to request additional training materials or webinars on the latest RERA compliance requirements.',
        category: 'feature-request',
        priority: 'low',
        status: 'open',
        createdDate: '2024-12-31T08:30:00Z',
        lastUpdated: '2024-12-31T08:30:00Z',
        responses: [],
        attachments: [],
        tags: ['training', 'rera', 'compliance', 'education']
      }
    ]

    const mockFAQs: FAQ[] = [
      {
        id: 'FAQ001',
        question: 'How do I reset my password?',
        answer: 'To reset your password, go to the login page and click on "Forgot Password". Enter your registered email address and you will receive a password reset link. Follow the instructions in the email to create a new password.',
        category: 'account',
        helpful: 45,
        notHelpful: 3,
        tags: ['password', 'login', 'account'],
        lastUpdated: '2024-12-25T00:00:00Z'
      },
      {
        id: 'FAQ002',
        question: 'What file formats are supported for document upload?',
        answer: 'We support the following file formats: PDF, DOC, DOCX, JPG, JPEG, PNG. Maximum file size is 10MB per document. All uploaded documents are automatically encrypted and watermarked for security.',
        category: 'technical',
        helpful: 67,
        notHelpful: 2,
        tags: ['documents', 'upload', 'formats', 'security'],
        lastUpdated: '2024-12-28T00:00:00Z'
      },
      {
        id: 'FAQ003',
        question: 'How are payments calculated and when are they processed?',
        answer: 'Payments are calculated based on the type of legal service provided and the complexity of the case. Due diligence reports: ₹15,000-₹50,000, Legal opinions: ₹20,000-₹75,000. Payments are processed within 7 business days after case completion and client approval.',
        category: 'billing',
        helpful: 89,
        notHelpful: 5,
        tags: ['payment', 'billing', 'rates', 'processing'],
        lastUpdated: '2024-12-30T00:00:00Z'
      },
      {
        id: 'FAQ004',
        question: 'What are the RERA compliance requirements for legal partners?',
        answer: 'Legal partners must ensure all property transactions comply with RERA regulations. This includes verifying RERA registration numbers, checking project approvals, validating completion certificates, and ensuring all mandatory disclosures are made to buyers.',
        category: 'legal',
        helpful: 78,
        notHelpful: 4,
        tags: ['rera', 'compliance', 'legal', 'requirements'],
        lastUpdated: '2024-12-29T00:00:00Z'
      },
      {
        id: 'FAQ005',
        question: 'How do I update my professional credentials?',
        answer: 'To update your professional credentials, go to your profile settings and click on "Professional Information". You can update your Bar Council registration, years of experience, specialization areas, and upload relevant certificates. Changes require admin approval.',
        category: 'account',
        helpful: 34,
        notHelpful: 1,
        tags: ['profile', 'credentials', 'bar-council', 'verification'],
        lastUpdated: '2024-12-27T00:00:00Z'
      }
    ]

    setTimeout(() => {
      setTickets(mockTickets)
      setFilteredTickets(mockTickets)
      setFaqs(mockFAQs)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter tickets
  useEffect(() => {
    let filtered = tickets

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter)
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredTickets(filtered)
  }, [tickets, statusFilter, categoryFilter, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'waiting-response': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Monitor size={16} className="text-blue-500" />
      case 'account': return <User size={16} className="text-green-500" />
      case 'billing': return <Star size={16} className="text-yellow-500" />
      case 'legal': return <Shield size={16} className="text-purple-500" />
      case 'feature-request': return <Lightbulb size={16} className="text-orange-500" />
      case 'bug-report': return <AlertTriangle size={16} className="text-red-500" />
      default: return <HelpCircle size={16} className="text-gray-500" />
    }
  }

  const createTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const ticket: SupportTicket = {
      id: `ST${String(tickets.length + 1).padStart(3, '0')}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category as any,
      priority: newTicket.priority as any,
      status: 'open',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      responses: [],
      attachments: [],
      tags: []
    }

    setTickets(prev => [ticket, ...prev])
    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' })
    setShowNewTicketModal(false)
    toast.success('Support ticket created successfully!')
  }

  const sendResponse = () => {
    if (!newResponse.trim() || !selectedTicket) return

    const response: TicketResponse = {
      id: `R${Date.now()}`,
      message: newResponse,
      sender: 'user',
      senderName: 'Advocate Rajesh Kumar',
      timestamp: new Date().toISOString()
    }

    setTickets(prev => prev.map(ticket =>
      ticket.id === selectedTicket.id
        ? {
          ...ticket,
          responses: [...ticket.responses, response],
          lastUpdated: new Date().toISOString(),
          status: 'waiting-response'
        }
        : ticket
    ))

    setSelectedTicket(prev => prev ? {
      ...prev,
      responses: [...prev.responses, response],
      lastUpdated: new Date().toISOString(),
      status: 'waiting-response'
    } : null)

    setNewResponse('')
    toast.success('Response sent!')
  }

  const markFAQHelpful = (faqId: string, helpful: boolean) => {
    setFaqs(prev => prev.map(faq =>
      faq.id === faqId
        ? {
          ...faq,
          helpful: helpful ? faq.helpful + 1 : faq.helpful,
          notHelpful: !helpful ? faq.notHelpful + 1 : faq.notHelpful
        }
        : faq
    ))
    toast.success('Thank you for your feedback!')
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Get help, find answers, and contact our support team
          </p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          <Plus size={20} />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {tickets.filter(t => t.status === 'open' || t.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5h</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
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
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map(method => {
            const Icon = method.icon
            return (
              <div key={method.type} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{method.label}</h4>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{method.value}</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">{method.availability}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{method.responseTime}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex space-x-8 px-6">
            {[
              { id: 'tickets', label: 'My Tickets', count: tickets.length },
              { id: 'faq', label: 'FAQ', count: faqs.length },
              { id: 'guides', label: 'User Guides', count: 12 },
              { id: 'status', label: 'System Status', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-4 border-b-2 font-medium transition-all
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }
                `}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'tickets' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="waiting-response">Waiting Response</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="account">Account</option>
                  <option value="billing">Billing</option>
                  <option value="legal">Legal</option>
                  <option value="feature-request">Feature Request</option>
                  <option value="bug-report">Bug Report</option>
                  <option value="general">General</option>
                </select>
              </div>

              {/* Tickets List */}
              {filteredTickets.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No tickets found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No support tickets match your current filters
                  </p>
                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mx-auto"
                  >
                    <Plus size={20} />
                    <span>Create First Ticket</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTickets.map(ticket => (
                    <div key={ticket.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3 flex-1">
                          {getCategoryIcon(ticket.category)}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              {ticket.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>#{ticket.id}</span>
                          <span>{new Date(ticket.createdDate).toLocaleDateString()}</span>
                          <span>{ticket.responses.length} responses</span>
                          {ticket.assignedTo && (
                            <span>Assigned to: {ticket.assignedTo}</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowTicketModal(true)
                          }}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-4">
                {faqs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 dark:border-gray-800 rounded-xl">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h4>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown size={20} className="text-gray-400" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-400" />
                      )}
                    </button>

                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="pt-4">
                          <p className="text-gray-700 dark:text-gray-300 mb-4">{faq.answer}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Was this helpful?</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => markFAQHelpful(faq.id, true)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-lg transition-all"
                                >
                                  <ThumbsUp size={14} />
                                  <span>{faq.helpful}</span>
                                </button>
                                <button
                                  onClick={() => markFAQHelpful(faq.id, false)}
                                  className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition-all"
                                >
                                  <ThumbsDown size={14} />
                                  <span>{faq.notHelpful}</span>
                                </button>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Updated: {new Date(faq.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">User Guides</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive guides and tutorials coming soon
              </p>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">All Systems Operational</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Legal Partner Portal', status: 'operational', uptime: '99.9%' },
                  { name: 'Document Upload Service', status: 'operational', uptime: '99.8%' },
                  { name: 'Payment Processing', status: 'operational', uptime: '100%' },
                  { name: 'Communication System', status: 'operational', uptime: '99.7%' },
                  { name: 'Knowledge Base', status: 'operational', uptime: '99.9%' },
                  { name: 'Support System', status: 'operational', uptime: '100%' }
                ].map(service => (
                  <div key={service.name} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 dark:text-white">{service.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600 dark:text-green-400">Operational</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{service.uptime} uptime</div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical</option>
                    <option value="account">Account</option>
                    <option value="billing">Billing</option>
                    <option value="legal">Legal</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="bug-report">Bug Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
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
                  onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of your issue or request"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={createTicket}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  Create Ticket
                </button>
                <button
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedTicket.title}
                  </h2>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">#{selectedTicket.id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowTicketModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Original Message */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getCategoryIcon(selectedTicket.category)}
                  <span className="font-medium text-gray-900 dark:text-white">Original Request</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(selectedTicket.createdDate).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{selectedTicket.description}</p>
              </div>

              {/* Responses */}
              {selectedTicket.responses.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Conversation</h4>
                  {selectedTicket.responses.map(response => (
                    <div key={response.id} className={`
                      flex ${response.sender === 'user' ? 'justify-end' : 'justify-start'}
                    `}>
                      <div className={`
                        max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
                        ${response.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                        }
                      `}>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-sm font-medium">
                            {response.senderName}
                          </span>
                          <span className={`text-xs ${response.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Response Input */}
              {selectedTicket.status !== 'closed' && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Type your response..."
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      />
                    </div>
                    <button
                      onClick={sendResponse}
                      disabled={!newResponse.trim()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Rating (for resolved tickets) */}
              {selectedTicket.status === 'resolved' && !selectedTicket.rating && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Rate this support</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                    How satisfied are you with the resolution?
                  </p>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-all"
                      >
                        <Star size={20} className="text-yellow-400" />
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