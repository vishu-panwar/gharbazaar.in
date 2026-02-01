'use client'

import { useState } from 'react'
import Link from 'next/link'
import InteractiveBackground from '@/components/InteractiveBackground'
import ContactBackground from '@/components/backgrounds/ContactBackground'
import { motion, AnimatePresence } from 'framer-motion'
import { backendApi } from '@/lib/backendApi'
import { useModal } from '@/contexts/ModalContext'
import {
  Mail,
  Phone,
  Clock,
  Send,
  MessageCircle,
  Globe,
  Users,
  Shield,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Building2,
  Headphones,
  Heart,
  ArrowRight,
  User,
  HelpCircle,
  Target,
  Home,
  Search,
  Settings,
  AlertCircle,
  MapPin,
  PhoneCall,
  CreditCard,
  Lightbulb,
  Eye,
  Zap
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { showAlert } = useModal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Call backend API to send contact form
      const response = await backendApi.contact.sendMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      })

      if (response.referenceId || response.success) {
        const refId = response.referenceId || response.submissionId;
        showAlert({
          title: 'Message Sent Successfully!',
          message: `Thank you for reaching out. Our team has received your inquiry and will get back to you within 24-48 hours. Reference ID: ${refId}`,
          type: 'success'
        })
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        throw new Error(response.error || 'Failed to send message')
      }
    } catch (error: any) {
      console.error('Contact form error:', error)
      const errorMessage = error.message || 'Failed to send message'
      showAlert({
        title: 'Submission Failed',
        message: `Error: ${errorMessage}. Please try again or email us directly at gharbazaarofficial@zohomail.in`,
        type: 'error'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Contact Options
  const contactOptions = [
    {
      icon: HelpCircle,
      title: "General Queries",
      description: "For platform questions, pricing, listings",
      color: "blue",
      topics: ["How GharBazaar works", "Pricing information", "Platform features", "Getting started"]
    },
    {
      icon: Home,
      title: "Property Assistance",
      description: "For buying, selling, renting, or deal assistance",
      color: "green",
      topics: ["Property search help", "Listing assistance", "Deal support", "Documentation"]
    },
    {
      icon: CreditCard,
      title: "Premium & Payments",
      description: "For premium plans, listing fees, or payment help",
      color: "purple",
      topics: ["Premium subscriptions", "Payment issues", "Billing queries", "Refund requests"]
    },
    {
      icon: Lightbulb,
      title: "Feedback & Suggestions",
      description: "For ideas, improvements, or complaints",
      color: "orange",
      topics: ["Feature requests", "Bug reports", "User experience", "General feedback"]
    }
  ]

  // FAQs
  const faqs = [
    {
      question: 'How soon will I get a response?',
      answer: 'We usually respond within 24-48 hours during business days. For urgent queries, you can use our live chat or WhatsApp for faster response.'
    },
    {
      question: 'Is contacting free?',
      answer: 'Yes, absolutely! Contacting our support team is completely free. There are no charges for getting help or asking questions.'
    },
    {
      question: 'Will a broker call me?',
      answer: 'No, never! We are not brokers. Only our genuine GharBazaar support team will contact you. We never share your details with third-party brokers.'
    },
    {
      question: 'Is assistance mandatory?',
      answer: 'Not at all. All our services are optional. You can use GharBazaar completely independently or choose our assistance when you need it.'
    },
    {
      question: 'Can I list property after contacting?',
      answer: 'Yes, our team can guide you through the property listing process and help you create an effective listing that attracts genuine buyers.'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background villa image from home page */}
        <ContactBackground />

        {/* Very Light Gradient - Just to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[1]"></div>

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
                <MessageCircle className="text-emerald-400" size={16} />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Contact Support</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-white focus-visible:outline-none"
              >
                We're Here to Help You
                <span className="block home-glow mt-1">
                  Make the Right Move
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed"
              >
                Have a question? Need clarity? Want to list or explore properties? Reach out to us.
                We're real people building a transparent platform for your success.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <a
                  href="#contact-form"
                  className="btn-emerald inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </a>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=gharbazaarofficial@zohomail.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-emerald-outline inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Mail size={16} />
                  <span>Email Support</span>
                </a>
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
                  <span className="text-white text-xs font-semibold">Privacy Promise</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <Heart className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">User Experience First</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div >
      </section>

      {/* Contact Options Overview */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Choose the type of support you need and we'll connect you with the right team
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactOptions.map((option, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
                <div className={`w-16 h-16 bg-gradient-to-br from-${option.color}-500 to-${option.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <option.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">{option.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">{option.description}</p>

                <ul className="space-y-2 mb-6">
                  {option.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="text-green-500" size={16} />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact-form"
                  className={`block w-full text-center bg-gradient-to-r from-${option.color}-600 to-${option.color}-700 hover:from-${option.color}-700 hover:to-${option.color}-800 text-white py-3 rounded-xl font-semibold transition-all`}
                >
                  Contact Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Send className="text-white" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Fill out the form below and we'll get back to you soon
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    required
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="">Select a subject</option>
                    <option value="buying">Buying Property</option>
                    <option value="selling">Selling Property</option>
                    <option value="renting">Renting Property</option>
                    <option value="pricing">Pricing / Payments</option>
                    <option value="general">General Query</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none text-gray-900 dark:text-white"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>Submit Query</span>
                    </>
                  )}
                </button>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  We usually respond within 24–48 hours.
                </p>
              </form>
            </div>

            {/* Right: Company Details & Trust Info */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center">
                      <Mail className="text-teal-600 dark:text-teal-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                      <a href="mailto:gharbazaarofficial@zohomail.in" className="text-teal-600 dark:text-teal-400 hover:underline">
                        gharbazaarofficial@zohomail.in
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                      <Globe className="text-emerald-600 dark:text-emerald-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Service Area</p>
                      <p className="text-gray-600 dark:text-gray-300">India</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Clock className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Support Hours</p>
                      <p className="text-gray-600 dark:text-gray-300">Mon – Sat, 10 AM – 6 PM</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-start space-x-3">
                    <Shield className="text-green-600 dark:text-green-400 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200 mb-1">Privacy Promise</p>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Your information is safe with us. We never share your details with brokers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map/Location Section */}
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Reach</h3>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                    <MapPin className="text-white" size={48} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🇮🇳 Serving All of India</h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    Currently serving users across India with plans to expand our support coverage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Safety Note */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Shield className="text-white" size={48} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Transparency & Safety Promise
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed italic">
                "At GharBazaar, we value honest communication. There are no pressure calls,
                no forced follow-ups, and no hidden agendas."
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-700">
              <CheckCircle className="text-green-600 dark:text-green-400 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Spam Calls</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We respect your privacy and never make unwanted calls</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-700">
              <Eye className="text-blue-600 dark:text-blue-400 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Forced Sales</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">All our services are optional and user-controlled</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-700">
              <Heart className="text-purple-600 dark:text-purple-400 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">No Hidden Intentions</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Transparent communication with genuine support</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-2xl border border-teal-200 dark:border-teal-700">
              <Users className="text-teal-600 dark:text-teal-400 mx-auto mb-4" size={40} />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">User-First Communication</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">We prioritize your needs and preferences always</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
              <HelpCircle className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">QUICK ANSWERS</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Quick answers to common questions about contacting us
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="text-teal-600 dark:text-teal-400 flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Let's Make Property Decisions Simple & Transparent
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Ready to experience honest, pressure-free real estate support?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white hover:bg-gray-50 text-teal-600 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Building2 size={20} />
              <span>List Your Property</span>
            </Link>
            <Link
              href="/listings"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Search size={20} />
              <span>Explore Properties</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}