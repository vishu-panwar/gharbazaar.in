'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, Globe, Cookie, Bell } from 'lucide-react'

export default function PrivacyPolicyPage() {
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
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <Shield className="text-green-600 dark:text-green-400" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
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
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Lock size={32} />
              <div>
                <h2 className="text-2xl font-bold">Your Privacy Matters</h2>
                <p className="text-green-100">We are committed to protecting your personal information</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                This Privacy Policy explains how GharBazaar collects, uses, processes, and protects your personal information 
                when you use our platform. We believe in transparency and your right to privacy.
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1: Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Database className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Information We Collect</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <h4 className="font-semibold text-gray-900 dark:text-white">Personal Information:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Profile information and preferences</li>
                  <li>Property search history and saved listings</li>
                  <li>Communication records with other users</li>
                  <li>Payment information (processed securely by third parties)</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900 dark:text-white">Technical Information:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Location data (with your permission)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <UserCheck className="text-purple-600 dark:text-purple-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. How We Use Your Information</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide and improve our platform services</li>
                  <li>Facilitate communication between buyers and sellers</li>
                  <li>Personalize your experience and property recommendations</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send important updates and notifications</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Prevent fraud and ensure platform security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-orange-600 dark:text-orange-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Information Sharing and Disclosure</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>We may share your information with:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Other Users:</strong> Contact information when you express interest in a property</li>
                  <li><strong>Service Providers:</strong> Third-party companies that help us operate our platform</li>
                  <li><strong>Payment Processors:</strong> Secure payment gateways for transaction processing</li>
                  <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Partners:</strong> With your explicit consent for specific services</li>
                </ul>
                <p className="font-semibold text-gray-900 dark:text-white">
                  We never sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </section>

            {/* Section 4: Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="text-red-600 dark:text-red-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. Data Security</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>We implement robust security measures to protect your information:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure servers with regular security updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response procedures</li>
                </ul>
                <p>
                  While we strive to protect your information, no method of transmission over the internet 
                  is 100% secure. We cannot guarantee absolute security.
                </p>
              </div>
            </section>

            {/* Section 5: Cookies */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Cookie className="text-yellow-600 dark:text-yellow-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">5. Cookies and Tracking</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve website functionality and performance</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
                <p>
                  You can control cookie settings through your browser preferences. However, disabling cookies 
                  may affect some platform functionality.
                </p>
              </div>
            </section>

            {/* Section 6: Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="text-indigo-600 dark:text-indigo-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">6. Your Privacy Rights</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Access:</strong> Request a copy of your personal information</li>
                  <li><strong>Correct:</strong> Update or correct inaccurate information</li>
                  <li><strong>Delete:</strong> Request deletion of your personal information</li>
                  <li><strong>Restrict:</strong> Limit how we process your information</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Withdraw Consent:</strong> Opt-out of certain data processing</li>
                  <li><strong>Object:</strong> Object to processing for direct marketing</li>
                </ul>
                <p>
                  To exercise these rights, please contact us using the information provided below.
                </p>
              </div>
            </section>

            {/* Section 7: Data Retention */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <Database className="text-teal-600 dark:text-teal-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">7. Data Retention</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>We retain your information for as long as necessary to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide our services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Improve our services and user experience</li>
                </ul>
                <p>
                  When you delete your account, we will remove your personal information within 30 days, 
                  except where retention is required by law.
                </p>
              </div>
            </section>

            {/* Section 8: Children's Privacy */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="text-pink-600 dark:text-pink-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">8. Children's Privacy</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Our platform is not intended for children under 18 years of age. We do not knowingly 
                  collect personal information from children under 18. If we become aware that we have 
                  collected such information, we will take steps to delete it promptly.
                </p>
                <p>
                  If you are a parent or guardian and believe your child has provided us with personal 
                  information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 9: International Transfers */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-cyan-600 dark:text-cyan-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">9. International Data Transfers</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure appropriate safeguards are in place to protect your information in accordance 
                  with this privacy policy.
                </p>
                <p>
                  By using our platform, you consent to the transfer of your information to our facilities 
                  and service providers worldwide.
                </p>
              </div>
            </section>

            {/* Section 10: Updates */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <Bell className="text-violet-600 dark:text-violet-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">10. Policy Updates</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or applicable laws. We will notify you of significant changes by:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Posting the updated policy on our platform</li>
                  <li>Sending email notifications for material changes</li>
                  <li>Displaying prominent notices on our website</li>
                </ul>
                <p>
                  Your continued use of our platform after changes become effective constitutes acceptance 
                  of the updated policy.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="space-y-1">
                  <p><strong>Data Protection Officer:</strong> privacy@gharbazaar.in</p>
                  <p><strong>General Inquiries:</strong> support@gharbazaar.in</p>
                  <p><strong>Phone:</strong> +91 98000 12345</p>
                  <p><strong>Address:</strong> GharBazaar Private Limited, Delhi NCR, India</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                  We will respond to your privacy-related inquiries within 30 days.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}