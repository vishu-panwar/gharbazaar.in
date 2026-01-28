'use client'

import { useState, useEffect } from 'react'
import {
  Share2,
  Copy,
  MessageSquare,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Eye,
  TrendingUp,
  Users,
  Target,
  Zap,
  Star,
  Gift,
  CheckCircle,
  ExternalLink,
  QrCode,
  Smartphone,
  Globe,
  Image,
  Video,
  FileText,
  Palette,
  Megaphone,
  BarChart3,
  Calendar,
  Clock,
  IndianRupee,
  Award,
  Sparkles,
  Heart,
  ThumbsUp,
  Send,
  Link as LinkIcon,
  ArrowRight,
  Plus,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareLink {
  id: string
  title: string
  description: string
  url: string
  type: 'general' | 'buyer' | 'seller' | 'property' | 'service'
  category: string
  clicks: number
  conversions: number
  earnings: number
  createdAt: string
  isActive: boolean
  thumbnail?: string
}

interface ShareTemplate {
  id: string
  name: string
  platform: string
  content: string
  hashtags: string[]
  image?: string
  type: 'text' | 'image' | 'video'
}

interface ShareStats {
  totalClicks: number
  totalConversions: number
  totalEarnings: number
  conversionRate: number
  topPerformingLink: string
  thisWeekClicks: number
}

export default function ShareLinksPage() {
  const [user, setUser] = useState<any>(null)
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([])
  const [shareTemplates, setShareTemplates] = useState<ShareTemplate[]>([])
  const [stats, setStats] = useState<ShareStats | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('links')

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock data
    const mockLinks: ShareLink[] = [
      {
        id: 'SL001',
        title: 'GharBazaar - Find Your Dream Home',
        description: 'Discover verified properties with legal support and best prices',
        url: `https://gharbazaar.com/ref/P001`,
        type: 'general',
        category: 'General',
        clicks: 245,
        conversions: 12,
        earnings: 18000,
        createdAt: '2024-12-01T00:00:00Z',
        isActive: true,
        thumbnail: '/images/share-general.jpg'
      },
      {
        id: 'SL002',
        title: 'Sell Your Property Fast - GharBazaar',
        description: 'Get the best price for your property with our expert team',
        url: `https://gharbazaar.com/sell/ref/P001`,
        type: 'seller',
        category: 'Seller',
        clicks: 189,
        conversions: 8,
        earnings: 24000,
        createdAt: '2024-12-01T00:00:00Z',
        isActive: true,
        thumbnail: '/images/share-seller.jpg'
      },
      {
        id: 'SL003',
        title: 'Buy Property with Zero Brokerage',
        description: 'RERA approved properties with free legal verification',
        url: `https://gharbazaar.com/buy/ref/P001`,
        type: 'buyer',
        category: 'Buyer',
        clicks: 312,
        conversions: 15,
        earnings: 22500,
        createdAt: '2024-12-01T00:00:00Z',
        isActive: true,
        thumbnail: '/images/share-buyer.jpg'
      },
      {
        id: 'SL004',
        title: 'Premium Properties in Mumbai',
        description: 'Exclusive luxury properties with verified documents',
        url: `https://gharbazaar.com/mumbai/premium/ref/P001`,
        type: 'property',
        category: 'Premium',
        clicks: 156,
        conversions: 6,
        earnings: 15000,
        createdAt: '2024-12-01T00:00:00Z',
        isActive: true,
        thumbnail: '/images/share-premium.jpg'
      },
      {
        id: 'SL005',
        title: 'Free Property Valuation Service',
        description: 'Get accurate property valuation from certified experts',
        url: `https://gharbazaar.com/valuation/ref/P001`,
        type: 'service',
        category: 'Services',
        clicks: 98,
        conversions: 4,
        earnings: 6000,
        createdAt: '2024-12-01T00:00:00Z',
        isActive: true,
        thumbnail: '/images/share-service.jpg'
      }
    ]

    const mockTemplates: ShareTemplate[] = [
      {
        id: 'ST001',
        name: 'WhatsApp Property Alert',
        platform: 'whatsapp',
        content: '🏠 Looking for your dream home? \n\n✅ RERA Verified Properties\n✅ Zero Brokerage\n✅ Free Legal Support\n✅ Best Market Prices\n\nDiscover thousands of verified properties on GharBazaar!\n\n👆 Click the link to explore',
        hashtags: ['#RealEstate', '#Property', '#ZeroBrokerage', '#RERA'],
        type: 'text'
      },
      {
        id: 'ST002',
        name: 'Instagram Story Template',
        platform: 'instagram',
        content: 'Found the perfect platform for property deals! 🏡✨\n\nZero brokerage + Legal support = Best deals ever! 💯\n\nSwipe up to check it out! 👆',
        hashtags: ['#PropertyDeals', '#RealEstate', '#ZeroBrokerage', '#DreamHome', '#PropertyInvestment'],
        type: 'image',
        image: '/images/instagram-template.jpg'
      },
      {
        id: 'ST003',
        name: 'Facebook Post Template',
        platform: 'facebook',
        content: '🏠 Attention Property Seekers! 🏠\n\nTired of paying hefty brokerage fees? GharBazaar offers:\n\n🔸 Zero Brokerage Properties\n🔸 RERA Verified Listings\n🔸 Free Legal Verification\n🔸 Expert Guidance\n\nJoin thousands of happy customers who found their dream homes without any hidden costs!\n\n👇 Check it out now!',
        hashtags: ['#ZeroBrokerage', '#RealEstate', '#PropertyDeals', '#RERA', '#DreamHome'],
        type: 'text'
      },
      {
        id: 'ST004',
        name: 'LinkedIn Professional Post',
        platform: 'linkedin',
        content: 'Revolutionizing Real Estate with Technology 🏢\n\nGharBazaar is transforming how we buy and sell properties:\n\n• Transparent pricing with zero hidden costs\n• RERA compliance and legal verification\n• Technology-driven property matching\n• Professional support throughout the process\n\nPerfect for professionals looking for hassle-free property transactions.\n\n#RealEstate #PropTech #Investment #RERA',
        hashtags: ['#RealEstate', '#PropTech', '#Investment', '#RERA', '#Professional'],
        type: 'text'
      },
      {
        id: 'ST005',
        name: 'Twitter Quick Share',
        platform: 'twitter',
        content: '🏠 Game-changer in real estate! \n\n@GharBazaar offers:\n✅ Zero brokerage\n✅ RERA verified\n✅ Legal support\n✅ Best prices\n\nFinally, a platform that puts customers first! 🙌\n\n#ZeroBrokerage #RealEstate #PropertyDeals',
        hashtags: ['#ZeroBrokerage', '#RealEstate', '#PropertyDeals', '#RERA'],
        type: 'text'
      }
    ]

    const mockStats: ShareStats = {
      totalClicks: 1000,
      totalConversions: 45,
      totalEarnings: 85500,
      conversionRate: 4.5,
      topPerformingLink: 'Buy Property with Zero Brokerage',
      thisWeekClicks: 156
    }

    setTimeout(() => {
      setShareLinks(mockLinks)
      setShareTemplates(mockTemplates)
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  const copyToClipboard = (text: string, type: string = 'link') => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  const shareOnPlatform = (platform: string, link: ShareLink, template?: ShareTemplate) => {
    let url = ''
    let content = template?.content || `Check out this amazing property platform: ${link.title}`

    if (template) {
      content = template.content.replace('👆 Click the link to explore', link.url)
    }

    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(content + '\n\n' + link.url)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link.url)}&quote=${encodeURIComponent(content)}`
        break
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}&url=${encodeURIComponent(link.url)}`
        break
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link.url)}`
        break
      case 'instagram':
        copyToClipboard(content + '\n\n' + link.url, 'Instagram content')
        toast('Content copied! Paste it in your Instagram post/story')
        return
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(link.title)}&body=${encodeURIComponent(content + '\n\n' + link.url)}`
        break
    }

    if (url) {
      window.open(url, '_blank')
    }
  }

  const generateQRCode = (link: ShareLink) => {
    // In a real app, you'd use a QR code library
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link.url)}`
    window.open(qrUrl, '_blank')
  }

  const filteredLinks = shareLinks.filter(link => {
    const matchesCategory = selectedCategory === 'all' || link.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = ['all', ...Array.from(new Set(shareLinks.map(link => link.category)))]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading share links...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Share & Earn
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Share your referral links across social media and messaging platforms to maximize your earnings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clicks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalClicks?.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">+{stats?.thisWeekClicks} this week</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalConversions}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{stats?.conversionRate}% rate</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalEarnings?.toLocaleString()}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">From shares</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <IndianRupee className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Performer</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.topPerformingLink}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Best converting</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('links')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'links'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          <LinkIcon size={20} />
          <span>Share Links</span>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'templates'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
        >
          <FileText size={20} />
          <span>Content Templates</span>
        </button>
      </div>

      {/* Share Links Tab */}
      {activeTab === 'links' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all capitalize ${selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Share Links Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredLinks.map((link) => (
              <div key={link.id} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                {/* Link Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {link.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {link.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${link.type === 'buyer' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                            link.type === 'seller' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                              link.type === 'property' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                                link.type === 'service' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                  'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
                          }`}>
                          {link.category}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          Created {new Date(link.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${link.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{link.clicks}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Clicks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{link.conversions}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Conversions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{link.earnings.toLocaleString()}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Earned</p>
                    </div>
                  </div>

                  {/* Link URL */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 truncate flex-1 mr-3">
                        {link.url}
                      </p>
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Share Actions */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Share on Platforms</h4>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <button
                      onClick={() => shareOnPlatform('whatsapp', link)}
                      className="flex flex-col items-center space-y-2 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all group"
                    >
                      <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">WhatsApp</span>
                    </button>

                    <button
                      onClick={() => shareOnPlatform('facebook', link)}
                      className="flex flex-col items-center space-y-2 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all group"
                    >
                      <Facebook className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Facebook</span>
                    </button>

                    <button
                      onClick={() => shareOnPlatform('instagram', link)}
                      className="flex flex-col items-center space-y-2 p-3 bg-pink-50 dark:bg-pink-900/20 hover:bg-pink-100 dark:hover:bg-pink-900/40 rounded-xl transition-all group"
                    >
                      <Instagram className="w-6 h-6 text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-pink-700 dark:text-pink-300">Instagram</span>
                    </button>

                    <button
                      onClick={() => shareOnPlatform('twitter', link)}
                      className="flex flex-col items-center space-y-2 p-3 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/40 rounded-xl transition-all group"
                    >
                      <Twitter className="w-6 h-6 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium text-sky-700 dark:text-sky-300">Twitter</span>
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => shareOnPlatform('linkedin', link)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                    >
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => shareOnPlatform('email', link)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
                    >
                      <Mail size={16} />
                      <span>Email</span>
                    </button>
                    <button
                      onClick={() => generateQRCode(link)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all"
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Ready-to-Use Content Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Copy and customize these templates for different social media platforms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {shareTemplates.map((template) => (
              <div key={template.id} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${template.platform === 'whatsapp' ? 'bg-green-100 dark:bg-green-900/20' :
                          template.platform === 'facebook' ? 'bg-blue-100 dark:bg-blue-900/20' :
                            template.platform === 'instagram' ? 'bg-pink-100 dark:bg-pink-900/20' :
                              template.platform === 'linkedin' ? 'bg-blue-100 dark:bg-blue-900/20' :
                                template.platform === 'twitter' ? 'bg-sky-100 dark:bg-sky-900/20' :
                                  'bg-gray-100 dark:bg-gray-900/20'
                        }`}>
                        {template.platform === 'whatsapp' && <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />}
                        {template.platform === 'facebook' && <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        {template.platform === 'instagram' && <Instagram className="w-5 h-5 text-pink-600 dark:text-pink-400" />}
                        {template.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                        {template.platform === 'twitter' && <Twitter className="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{template.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{template.platform}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${template.type === 'text' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        template.type === 'image' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                      {template.type}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {template.content}
                    </p>
                  </div>

                  {template.hashtags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Hashtags:</p>
                      <div className="flex flex-wrap gap-2">
                        {template.hashtags.map((hashtag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(template.content + '\n\n' + template.hashtags.join(' '), 'Template')}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                    >
                      <Copy size={16} />
                      <span>Copy Template</span>
                    </button>
                    <button
                      onClick={() => {
                        const link = shareLinks[0] // Use first link as default
                        shareOnPlatform(template.platform, link, template)
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pro Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-yellow-200 dark:border-yellow-800">
        <div className="text-center mb-6">
          <Sparkles className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pro Sharing Tips
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Maximize Reach:</h4>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Share at peak hours (7-9 PM) for better engagement</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Use platform-specific content templates</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Add personal experiences and testimonials</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Share in relevant groups and communities</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 dark:text-white">Higher Conversions:</h4>
            <ul className="text-gray-700 dark:text-gray-300 space-y-2">
              <li className="flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>Target specific property types for your audience</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>Share success stories and customer reviews</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>Use QR codes for offline sharing</span>
              </li>
              <li className="flex items-start space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                <span>Follow up with interested prospects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}