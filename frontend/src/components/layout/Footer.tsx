import Link from 'next/link'
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  Building2,
  Home,
  TrendingUp,
  Shield,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="/logo.jpeg"
                alt="GharBazaar Logo"
                className="h-16 w-auto object-contain rounded-lg shadow-lg"
              />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">
                GharBazaar
              </h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              India's most trusted property platform. Transparent pricing. Zero pressure.
              Optional assistance. Built for India.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:support@gharbazaar.in" className="flex items-center space-x-3 text-gray-400 hover:text-teal-400 transition-colors group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                  <Mail size={18} className="text-gray-400 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">support@gharbazaar.in</div>
                </div>
              </a>
              <a href="tel:+919800000000" className="flex items-center space-x-3 text-gray-400 hover:text-emerald-400 transition-colors group">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <Phone size={18} className="text-gray-400 group-hover:text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">+91 98XXXXXXXX</div>
                </div>
              </a>
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-gray-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-300">Delhi NCR, India</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-teal-500 mr-3 rounded-full"></span>
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/founder" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Our Founder</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-400 hover:text-teal-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-emerald-500 mr-3 rounded-full"></span>
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/listings" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
                  <Building2 size={14} className="mr-2 text-emerald-500" />
                  <span>Browse Properties</span>
                </Link>
              </li>
              <li>
                <Link href="/signup" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
                  <Home size={14} className="mr-2 text-teal-500" />
                  <span>List Property</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
                  <TrendingUp size={14} className="mr-2 text-blue-500" />
                  <span>Premium Plans</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Get Assistance</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-emerald-400 transition-colors group">
                  <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Dashboard</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-lg text-white mb-6 flex items-center">
              <span className="w-1 h-6 bg-blue-500 mr-3 rounded-full"></span>
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Get the latest property listings and market insights delivered to your inbox.
            </p>
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <Send size={16} className="text-white" />
                </button>
              </div>
              <p className="text-xs text-gray-500">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white mb-3">Follow Us</h4>
              <div className="flex items-center space-x-2">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-lg flex items-center justify-center transition-all group">
                  <Facebook size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-lg flex items-center justify-center transition-all group">
                  <Twitter size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-lg flex items-center justify-center transition-all group">
                  <Instagram size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-lg flex items-center justify-center transition-all group">
                  <Linkedin size={18} className="text-gray-400 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-lg flex items-center justify-center transition-all group">
                  <Youtube size={18} className="text-gray-400 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="text-center lg:text-left">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} <span className="text-white font-semibold">GharBazaar.in</span> - All Rights Reserved.
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Made with ❤️ in India | Empowering Real Estate Dreams
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-500 hover:text-teal-400 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-teal-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/disclaimer" className="text-gray-500 hover:text-teal-400 transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
            <span className="flex items-center space-x-2">
              <Shield size={14} className="text-teal-500" />
              <span>SSL Secured</span>
            </span>
            <span className="text-gray-700">•</span>
            <span className="flex items-center space-x-2">
              <Award size={14} className="text-emerald-500" />
              <span>Trusted Platform</span>
            </span>
            <span className="text-gray-700">•</span>
            <span>Serving 10,000+ Happy Customers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
