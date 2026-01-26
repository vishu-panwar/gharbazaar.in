'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, FileText, AlertCircle, CheckCircle, Scale, Users, Globe } from 'lucide-react'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600 dark:text-blue-400" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Terms & Conditions</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last updated: December 26, 2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Scale size={32} />
              <div>
                <h2 className="text-2xl font-bold">Welcome to GharBazaar</h2>
                <p className="text-blue-100">Please read these terms carefully before using our services</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                By accessing and using GharBazaar.in, you accept and agree to be bound by the terms and provision of this agreement. 
                These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1: Acceptance of Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  By accessing and using GharBazaar.in ("the Platform"), you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  These terms constitute a legally binding agreement between you and GharBazaar Private Limited, 
                  governing your use of our platform and services.
                </p>
              </div>
            </section>

            {/* Section 2: Platform Description */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Platform Description</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  GharBazaar is an online platform that connects property buyers and sellers in India. We provide:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Property listing and browsing services</li>
                  <li>Virtual property tours and detailed information</li>
                  <li>Communication tools between buyers and sellers</li>
                  <li>Market analytics and pricing insights</li>
                  <li>Premium subscription services for enhanced features</li>
                </ul>
                <p>
                  We act as an intermediary platform and do not directly engage in property transactions.
                </p>
              </div>
            </section>

            {/* Section 3: User Accounts */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600 dark:text-purple-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. User Accounts and Registration</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  To access certain features of our platform, you must create an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p>
                  You must be at least 18 years old to create an account and use our services.
                </p>
              </div>
            </section>

            {/* Section 4: User Conduct */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="text-orange-600 dark:text-orange-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. User Conduct and Prohibited Activities</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Post false, misleading, or fraudulent property listings</li>
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Upload malicious software or attempt to hack the platform</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Create multiple accounts to circumvent restrictions</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Property Listings */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="text-green-600 dark:text-green-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">5. Property Listings and Content</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>When listing properties, you warrant that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You have the legal right to list the property</li>
                  <li>All information provided is accurate and up-to-date</li>
                  <li>Photos and descriptions represent the actual property</li>
                  <li>The property complies with all applicable laws and regulations</li>
                  <li>You have necessary permissions for all uploaded content</li>
                </ul>
                <p>
                  We reserve the right to remove any listing that violates these terms or appears suspicious.
                </p>
              </div>
            </section>

            {/* Section 6: Payment and Fees */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Scale className="text-yellow-600 dark:text-yellow-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">6. Payment Terms and Fees</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>Our platform operates on a freemium model:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Basic browsing and contact features are free</li>
                  <li>Premium features require subscription payment</li>
                  <li>Property listing fees may apply for sellers</li>
                  <li>All fees are clearly displayed before payment</li>
                  <li>Payments are processed securely through third-party providers</li>
                  <li>Refunds are subject to our refund policy</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Disclaimer */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-red-600 dark:text-red-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">7. Disclaimers and Limitations</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  GharBazaar provides the platform "as is" without warranties of any kind. We do not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Guarantee the accuracy of property information</li>
                  <li>Verify the identity or credentials of users</li>
                  <li>Participate in actual property transactions</li>
                  <li>Provide legal, financial, or real estate advice</li>
                  <li>Guarantee successful property sales or purchases</li>
                </ul>
                <p>
                  Users are responsible for conducting their own due diligence before any property transaction.
                </p>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <AlertCircle className="text-gray-600 dark:text-gray-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">8. Account Termination</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We reserve the right to suspend or terminate your account if you violate these terms. 
                  You may also terminate your account at any time by contacting our support team.
                </p>
                <p>
                  Upon termination, your access to the platform will cease, but these terms will continue 
                  to apply to any prior use of the service.
                </p>
              </div>
            </section>

            {/* Section 9: Changes to Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <FileText className="text-indigo-600 dark:text-indigo-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">9. Modifications to Terms</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately 
                  upon posting on the platform. Your continued use of the service after changes constitutes 
                  acceptance of the new terms.
                </p>
                <p>
                  We recommend reviewing these terms periodically to stay informed of any updates.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>If you have any questions about these Terms & Conditions, please contact us:</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> legal@gharbazaar.in</p>
                  <p><strong>Phone:</strong> +91 98000 12345</p>
                  <p><strong>Address:</strong> GharBazaar Private Limited, Delhi NCR, India</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}