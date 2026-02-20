'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import InteractiveBackground from '@/components/InteractiveBackground'
import AboutBackground from '@/components/backgrounds/AboutBackground'
import { motion } from 'framer-motion'
import {
  Home,
  Building2,
  Users,
  Shield,
  CheckCircle,
  X,
  ArrowRight,
  Eye,
  DollarSign,
  Heart,
  Zap,
  Target,
  Award,
  TrendingUp,
  Star,
  Lightbulb,
  UserCheck,
  Globe,
  FileCheck,
  Lock,
  Search
} from 'lucide-react'

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const problems = [
    {
      icon: DollarSign,
      title: "High Broker Commissions",
      description: "Traditional brokers charge 2-3% commission, making property deals expensive"
    },
    {
      icon: Users,
      title: "Forced Middlemen",
      description: "You're forced to work with agents even when you prefer direct deals"
    },
    {
      icon: Eye,
      title: "Lack of Transparency",
      description: "Hidden charges, unclear processes, and surprise fees at the last moment"
    },
    {
      icon: Target,
      title: "Pressure Tactics",
      description: "Aggressive sales tactics and rushed decisions without proper evaluation"
    }
  ]

  const solutions = [
    {
      icon: DollarSign,
      title: "Flat ₹1000 Listing Fee",
      description: "One-time payment until sold/rented. No recurring charges or hidden fees"
    },
    {
      icon: Eye,
      title: "Free Browsing",
      description: "Buyers and renters can explore all properties completely free"
    },
    {
      icon: Star,
      title: "Optional Premium",
      description: "Pay only if you want direct contact features. Your choice, always"
    },
    {
      icon: UserCheck,
      title: "1% Assisted Deals",
      description: "Optional full assistance at industry's lowest 1% commission"
    }
  ]

  const philosophy = [
    {
      icon: Shield,
      title: "Transparency over Pressure",
      description: "Clear pricing, honest communication, no hidden agendas"
    },
    {
      icon: Heart,
      title: "Choice over Compulsion",
      description: "You decide how much help you want, when you want it"
    },
    {
      icon: Zap,
      title: "Technology over Agents",
      description: "Smart platform that empowers you instead of controlling you"
    },
    {
      icon: Award,
      title: "Trust over Hype",
      description: "Realistic promises, genuine service, long-term relationships"
    }
  ]

  const howItWorks = [
    {
      step: "1",
      title: "List Property",
      description: "Pay ₹1000 one-time fee. Your property goes live until sold/rented",
      icon: Home
    },
    {
      step: "2",
      title: "Buyers Explore",
      description: "Buyers and renters browse all properties completely free",
      icon: Search
    },
    {
      step: "3",
      title: "Premium Access",
      description: "Upgrade to premium only if you want direct contact features",
      icon: Star
    },
    {
      step: "4",
      title: "Optional Assistance",
      description: "Choose our 1% assisted deal service or handle it yourself",
      icon: UserCheck
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background villa image from home page */}
        <AboutBackground />

        {/* Very Light Gradient - Just to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-[1]"></div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8">
          <div className="h-full grid lg:grid-cols-12 gap-8 items-center pt-20 sm:pt-24 lg:pt-28">

            {/* LEFT SIDE - Shifted Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-4 sm:space-y-5 lg:pl-12 xl:pl-16 -mt-[150px] lg:mt-0"
            >

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30 mb-2"
              >
                <Building2 className="text-emerald-400" size={16} />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">About GharBazaar</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-white"
              >
                Redefining How India
                <span className="block home-glow mt-1">
                  Buys, Sells & Rents
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed"
              >
                GharBazaar is built to remove confusion, pressure, and unfair commissions from Indian real estate.
                We believe every family deserves a transparent, affordable way to find their dream home.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link
                  href="/listings"
                  className="btn-emerald inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <span>Explore Properties</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/signup"
                  className="btn-emerald-outline inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Building2 size={16} />
                  <span>List Your Property</span>
                </Link>
              </motion.div>

              {/* Minimal Trust Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="flex items-center space-x-2 pt-8"
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <CheckCircle className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">100% Transparent Platform</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is GharBazaar */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              What is GharBazaar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              GharBazaar is a property listing and assistance platform designed specifically for Indian market realities.
              We give you the freedom to choose how much help you want, when you want it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-3xl border border-teal-200 dark:border-teal-700">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Home className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Buy Property</h3>
              <p className="text-gray-700 dark:text-gray-200">
                Browse verified properties, connect with owners, and make informed decisions with complete transparency.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-3xl border border-emerald-200 dark:border-emerald-700">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sell Property</h3>
              <p className="text-gray-700 dark:text-gray-200">
                List your property for just ₹1000 and reach thousands of genuine buyers without any pressure tactics.
              </p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-3xl border border-blue-200 dark:border-blue-700">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-white" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rent Property</h3>
              <p className="text-gray-700 dark:text-gray-200">
                Find rental properties or list yours with complete flexibility and transparent pricing throughout.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems with Traditional Real Estate */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              The Problem with Traditional Real Estate
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              We identified the pain points that make property transactions stressful and expensive in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((problem, index) => (
              <div key={index} className="p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-800/50 rounded-xl flex items-center justify-center mb-4">
                  <problem.icon className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{problem.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{problem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The GharBazaar Approach */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              The GharBazaar Approach
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              We've built solutions that put you in control while keeping costs transparent and affordable
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((solution, index) => (
              <div key={index} className="p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800/50 rounded-xl flex items-center justify-center mb-4">
                  <solution.icon className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{solution.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{solution.description}</p>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Traditional Broker vs GharBazaar</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center">
                  <X className="mr-2" size={20} />
                  Traditional Broker
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <X className="text-red-500 mr-3" size={16} />
                    <span>2-3% commission (₹2-3 lakh on ₹1 crore)</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <X className="text-red-500 mr-3" size={16} />
                    <span>Forced to use their services</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <X className="text-red-500 mr-3" size={16} />
                    <span>Hidden charges and surprise fees</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <X className="text-red-500 mr-3" size={16} />
                    <span>Pressure tactics and rushed decisions</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="mr-2" size={20} />
                  GharBazaar
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500 mr-3" size={16} />
                    <span>₹1000 listing + optional 1% assistance</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500 mr-3" size={16} />
                    <span>You choose level of involvement</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500 mr-3" size={16} />
                    <span>Transparent pricing, no surprises</span>
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-300">
                    <CheckCircle className="text-green-500 mr-3" size={16} />
                    <span>Take your time, make informed decisions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Philosophy
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              These core beliefs guide every decision we make and every feature we build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {philosophy.map((belief, index) => (
              <div key={index} className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <belief.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{belief.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{belief.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How GharBazaar Works */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              How GharBazaar Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Simple, transparent process that puts you in control at every step
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-teal-500 to-transparent -translate-x-1/2"></div>
                )}
                <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl">
                    {step.step}
                  </div>
                  <step.icon className="text-teal-600 dark:text-teal-400 mx-auto mb-4" size={32} />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder's Note */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <span className="text-white font-bold text-2xl">VP</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Vishu Panwar</h3>
              <p className="text-teal-600 dark:text-teal-400 font-semibold">Founder & CEO</p>
            </div>

            <blockquote className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center italic mb-8">
              "I started GharBazaar to ensure that property decisions are made with clarity, not pressure.
              Our goal is not to replace choice, but to empower it. Every family deserves transparent,
              affordable access to their dream home without the stress of hidden agendas or unfair commissions."
            </blockquote>

            <div className="text-center">
              <Link
                href="/founder"
                className="inline-flex items-center text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold space-x-2"
              >
                <span>Read full founder story</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency & Fair Practices */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Transparency & Fair Practices
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Our commitment to honest, transparent business practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl border border-green-200 dark:border-green-700">
              <Shield className="text-green-600 dark:text-green-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Forced Commission</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">You decide if you want our assistance. Never forced, always optional.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl border border-blue-200 dark:border-blue-700">
              <Eye className="text-blue-600 dark:text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Hidden Fees</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">What you see is what you pay. Complete transparency in all charges.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl border border-purple-200 dark:border-purple-700">
              <Heart className="text-purple-600 dark:text-purple-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">User Decides Involvement</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Choose your level of engagement. From DIY to full assistance.</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-2xl border border-teal-200 dark:border-teal-700">
              <UserCheck className="text-teal-600 dark:text-teal-400 mx-auto mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Assistance is Optional</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Our help is available when you need it, not when we want to sell it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for India */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              🇮🇳 Built for India
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Understanding Indian market realities and building solutions that actually work here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
              <Globe className="text-orange-600 dark:text-orange-400 mx-auto mb-6" size={48} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Indian Cities & Local Markets</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Deep understanding of local market dynamics, pricing patterns, and regional preferences across Indian cities.
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
              <FileCheck className="text-green-600 dark:text-green-400 mx-auto mb-6" size={48} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Circle Rate Aligned Deals</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Pricing transparency that considers circle rates, stamp duty, and registration charges for realistic budgeting.
              </p>
            </div>

            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700">
              <Lock className="text-blue-600 dark:text-blue-400 mx-auto mb-6" size={48} />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Indian Legal & Compliance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                RERA compliance, proper documentation guidance, and awareness of Indian property laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Future Vision */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Future Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
              Realistic, achievable goals that will make property transactions even better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <CheckCircle className="text-green-600 dark:text-green-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Verified Listings</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Enhanced verification process for all property listings</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Zap className="text-blue-600 dark:text-blue-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smarter Matching</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">AI-powered recommendations based on your preferences</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Lightbulb className="text-yellow-600 dark:text-yellow-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Better Tools</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Enhanced tools for buyers, sellers, and renters</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              <Shield className="text-purple-600 dark:text-purple-400 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Technology-Driven Transparency</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">More transparency through better technology</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-600 via-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join thousands of satisfied customers who chose transparency over pressure
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
