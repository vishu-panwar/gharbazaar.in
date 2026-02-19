'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import InteractiveBackground from '@/components/InteractiveBackground'
import FounderBackground from '@/components/backgrounds/FounderBackground'
import { motion } from 'framer-motion'
import {
  Users,
  Shield,
  CheckCircle,
  ArrowRight,
  Eye,
  Heart,
  Zap,
  Award,
  Star,
  Target,
  Code,
  Scale,
  Building2,
  Globe,
  TrendingUp,
  Settings,
  FileText,
  Search,
  Crown,
  Briefcase,
  DollarSign,
  Gavel,
  Laptop,
  BarChart3,
  MapPin,
  Lightbulb
} from 'lucide-react'

export default function FounderPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getAuthorityBadge = (authority: string) => {
    const badges = {
      'Final Authority': { color: 'bg-red-500', emoji: '🔴', text: 'Final Authority' },
      'Full Execution': { color: 'bg-orange-500', emoji: '🟠', text: 'Full Execution' },
      'Operational': { color: 'bg-green-500', emoji: '🟢', text: 'Operational' },
      'Financial': { color: 'bg-green-500', emoji: '🟢', text: 'Financial' },
      'Technical': { color: 'bg-green-500', emoji: '🟢', text: 'Technical' },
      'Marketing': { color: 'bg-green-500', emoji: '🟢', text: 'Marketing' },
      'City-Level': { color: 'bg-green-500', emoji: '🟢', text: 'City-Level' },
      'Analytics': { color: 'bg-blue-500', emoji: '🔵', text: 'Analytics' },
      'Legal Veto': { color: 'bg-red-500', emoji: '🔴', text: 'Legal Veto' },
      'Strategic Advisory': { color: 'bg-orange-500', emoji: '🟠', text: 'Strategic Advisory' }
    }
    return badges[authority as keyof typeof badges] || badges['Operational']
  }

  const teamMembers = [
    {
      name: "Vishu Panwar",
      role: "Founder & Vision Owner",
      department: "Leadership",
      goal: "To build GharBazaar as a long-term, ethical, and trusted real estate ecosystem.",
      responsibilities: [
        "Define vision, mission, and values",
        "Approve business models and expansion",
        "Maintain ethics, transparency, and fairness",
        "Represent GharBazaar at strategic levels"
      ],
      workflow: [
        "Receives reports from CEO",
        "Reviews strategic decisions",
        "Guides leadership"
      ],
      authority: "Final Authority",
      avatar: "VP",
      color: "from-emerald-600 to-teal-700",
      icon: Crown
    },
    {
      name: "Ajay Pratap Singh Sengar",
      role: "Chief Executive Officer (CEO)",
      department: "Leadership",
      goal: "To convert the Founder's vision into operational reality.",
      responsibilities: [
        "Company-wide execution",
        "Department coordination",
        "Performance monitoring",
        "Conflict resolution"
      ],
      workflow: [
        "Works daily with COO",
        "Weekly reporting to Founder"
      ],
      authority: "Full Execution",
      avatar: "AS",
      color: "from-orange-600 to-red-600",
      icon: Briefcase
    },
    {
      name: "Parul",
      role: "Chief Operating Officer (COO)",
      department: "Operations",
      goal: "To ensure smooth, reliable day-to-day functioning.",
      responsibilities: [
        "Property listing lifecycle management",
        "Buyer & seller process clarity",
        "Branch manager coordination",
        "SOP enforcement"
      ],
      workflow: [
        "Reports to CEO",
        "Manages ops & tech execution"
      ],
      authority: "Operational",
      avatar: "PA",
      color: "from-green-600 to-emerald-600",
      icon: Settings
    },
    {
      name: "Indu",
      role: "Chief Financial Officer (CFO)",
      department: "Finance",
      goal: "To keep GharBazaar financially healthy and scalable.",
      responsibilities: [
        "Pricing & subscription logic",
        "Revenue planning",
        "Cost control",
        "Payment flow oversight"
      ],
      workflow: [
        "Works with CEO & COO",
        "Reviews financial performance"
      ],
      authority: "Financial",
      avatar: "IN",
      color: "from-green-600 to-teal-600",
      icon: DollarSign
    },
    {
      name: "Navya",
      role: "Legal & Compliance Head (Temporary)",
      department: "Legal",
      goal: "To protect GharBazaar from legal, regulatory, and trust risks.",
      responsibilities: [
        "Draft & review legal documents",
        "Ensure IT & property law compliance",
        "Feature-level legal approval",
        "Risk prevention"
      ],
      workflow: [
        "Handling in place of Yash",
        "Legal review processes"
      ],
      authority: "Legal Veto",
      avatar: "NA",
      color: "from-red-600 to-pink-600",
      icon: Gavel
    },
    {
      name: "Aditya & Mayank",
      role: "Developers (Tech Team)",
      department: "Technology",
      goal: "To build a stable, secure, and scalable website.",
      responsibilities: [
        "Frontend & backend development",
        "Bug fixing",
        "Feature deployment",
        "Performance optimization"
      ],
      workflow: [
        "Development sprints",
        "Code reviews and testing"
      ],
      authority: "Technical",
      avatar: "AM",
      color: "from-green-600 to-blue-600",
      icon: Laptop
    },
    {
      name: "Vansh Tyagi",
      role: "Marketing & Business Development",
      department: "Marketing",
      goal: "To grow buyers, sellers, and brand presence.",
      responsibilities: [
        "Lead generation",
        "Campaign strategy",
        "Seller onboarding",
        "Partnerships"
      ],
      workflow: [
        "Marketing campaigns",
        "Business development activities"
      ],
      authority: "Marketing",
      avatar: "VT",
      color: "from-green-600 to-purple-600",
      icon: TrendingUp
    },
    {
      name: "Abhinav Tyagi",
      role: "Marketing Operations & Analytics",
      department: "Analytics",
      goal: "To make growth measurable and optimized.",
      responsibilities: [
        "Traffic & lead tracking",
        "Conversion analytics",
        "Campaign reports",
        "Optimization insights"
      ],
      workflow: [
        "Data analysis",
        "Performance reporting"
      ],
      authority: "Analytics",
      avatar: "AT",
      color: "from-blue-600 to-indigo-600",
      icon: BarChart3
    },
    {
      name: "Priyanshu Saini",
      role: "Branch Manager (Saharanpur)",
      department: "Operations",
      goal: "To ensure local trust and accuracy.",
      responsibilities: [
        "Property verification",
        "Seller coordination",
        "Buyer assistance",
        "City-level reporting"
      ],
      workflow: [
        "Local operations management",
        "Regional coordination"
      ],
      authority: "City-Level",
      avatar: "PS",
      color: "from-green-600 to-emerald-600",
      icon: MapPin
    },
    {
      name: "Yash Kamboj",
      role: "Branch Manager (Roorkee)",
      department: "Operations",
      goal: "To prepare and manage Roorkee expansion.",
      responsibilities: [
        "Local listings",
        "Market insights",
        "Regional partnerships",
        "Execution"
      ],
      workflow: [
        "Regional expansion",
        "Local market development"
      ],
      authority: "City-Level",
      avatar: "YK",
      color: "from-green-600 to-teal-600",
      icon: MapPin
    },
    {
      name: "Devraj",
      role: "Strategic Operations",
      department: "Strategy",
      goal: "To make GharBazaar future-ready.",
      responsibilities: [
        "Process optimization",
        "Expansion frameworks",
        "Strategic planning"
      ],
      workflow: [
        "Strategic analysis",
        "Future planning"
      ],
      authority: "Strategic Advisory",
      avatar: "DR",
      color: "from-orange-600 to-yellow-600",
      icon: Lightbulb
    }
  ]

  const departments = [
    {
      name: "Leadership",
      icon: Crown,
      description: "Vision, strategy, and overall company direction",
      count: 2,
      color: "from-purple-500 to-indigo-600"
    },
    {
      name: "Operations",
      icon: Settings,
      description: "Daily operations, property management, and city-level execution",
      count: 3,
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Finance",
      icon: DollarSign,
      description: "Financial planning, pricing, and revenue management",
      count: 1,
      color: "from-blue-500 to-cyan-600"
    },
    {
      name: "Legal",
      icon: Gavel,
      description: "Legal compliance, documentation, and risk management",
      count: 1,
      color: "from-red-500 to-pink-600"
    },
    {
      name: "Technology",
      icon: Laptop,
      description: "Platform development, maintenance, and technical innovation",
      count: 1,
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Marketing",
      icon: TrendingUp,
      description: "Growth, lead generation, and brand development",
      count: 1,
      color: "from-pink-500 to-rose-600"
    },
    {
      name: "Analytics",
      icon: BarChart3,
      description: "Data analysis, performance tracking, and optimization",
      count: 1,
      color: "from-cyan-500 to-blue-600"
    },
    {
      name: "Strategy",
      icon: Lightbulb,
      description: "Long-term planning and strategic operations",
      count: 1,
      color: "from-yellow-500 to-orange-600"
    }
  ]

  const platformSummary = {
    title: "GharBazaar Platform + Team Summary",
    description: "GharBazaar is a digital real estate platform that combines technology, local execution, transparent pricing, legal compliance, and a clearly accountable team to simplify property buying, selling, renting, and leasing across India."
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background villa image from home page */}
        <FounderBackground />

        {/* Very Light Gradient - Just to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-[1]"></div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8">
          <div className="h-full grid lg:grid-cols-12 gap-8 items-center pt-28">

            {/* LEFT SIDE - Shifted Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 space-y-5 lg:pl-12 xl:pl-16"
            >

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30 mb-2"
              >
                <Users className="text-emerald-400" size={16} />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Meet the Team</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-white focus-visible:outline-none"
              >
                The Dedicated Minds Behind
                <span className="block home-glow mt-1">
                  GharBazaar's Success
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed"
              >
                11 professionals across 8 departments building India's most transparent real estate platform.
                We're committed to integrity, innovation, and your property success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link
                  href="/dashboard"
                  className="btn-emerald inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Search size={16} />
                  <span>Explore Platform</span>
                </Link>
                <Link
                  href="/signup"
                  className="btn-emerald-outline inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Building2 size={16} />
                  <span>Join Our Journey</span>
                </Link>
              </motion.div>

              {/* Minimal Trust Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="flex items-center space-x-4 pt-8"
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <Shield className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">Verified Team</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <Globe className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">Pan-India Reach</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Summary */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 rounded-full mb-6">
              <Globe className="text-emerald-600 dark:text-emerald-400" size={20} />
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold">PLATFORM OVERVIEW</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {platformSummary.title}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-relaxed">
              {platformSummary.description}
            </p>
          </div>
        </div>
      </section>

      {/* Department Overview */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              8 Departments, 11 Professionals
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Each department with clear authority levels and specific responsibilities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-xl flex items-center justify-center mb-4`}>
                  <dept.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{dept.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{dept.description}</p>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">{dept.count} Member{dept.count > 1 ? 's' : ''}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Members - Detailed Breakdown */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Team Breakdown
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Detailed roles, responsibilities, workflows, and authority levels for each team member
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{member.department}</p>

                  <div className="mb-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${getAuthorityBadge(member.authority).color} text-white text-sm font-semibold`}>
                      <span>{getAuthorityBadge(member.authority).emoji}</span>
                      <span>{getAuthorityBadge(member.authority).text}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm">{member.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authority Levels Legend */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Authority Levels Explained
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Clear hierarchy and decision-making authority across the organization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">🔴</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Final Authority</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Absolute decision-making power and strategic direction</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">🟠</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Full Execution</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Company-wide execution and operational authority</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">🟢</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Departmental</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Operational, financial, technical, marketing, and city-level authority</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">🔵</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Data analysis and advisory authority</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Statistics */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Team at a Glance
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-3xl border border-emerald-200 dark:border-emerald-800">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">11</div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold">Total Team Members</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-3xl border border-teal-200 dark:border-teal-800">
              <div className="text-4xl font-bold text-teal-600 dark:text-teal-400 mb-2">8</div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold">Departments</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-3xl border border-blue-200 dark:border-blue-800">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">2</div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold">City Branches</div>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-200 dark:border-indigo-800">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">4</div>
              <div className="text-gray-600 dark:text-gray-300 font-semibold">Authority Levels</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Experience Our Team's Work
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            See how our dedicated team creates transparent real estate solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-50 text-emerald-600 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Building2 size={20} />
              <span>Join Platform</span>
            </Link>
            <Link
              href="/dashboard"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>Explore Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}