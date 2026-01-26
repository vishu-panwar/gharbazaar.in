'use client'

import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Info, Shield, Eye, Scale, Building2, Users, Globe } from 'lucide-react'

export default function DisclaimerPage() {
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
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-orange-600 dark:text-orange-400" size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Disclaimer</h1>
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
          <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <Info size={32} />
              <div>
                <h2 className="text-2xl font-bold">Important Disclaimer</h2>
                <p className="text-orange-100">Please read this disclaimer carefully before using our platform</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                This disclaimer governs your use of GharBazaar.in. By using our platform, you accept this disclaimer 
                in full. If you disagree with any part of this disclaimer, do not use our platform.
              </p>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Section 1: General Disclaimer */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-red-600 dark:text-red-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. General Disclaimer</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  The information on this platform is provided on an "as is" basis. To the fullest extent permitted by law, 
                  GharBazaar excludes all representations, warranties, obligations, and liabilities arising out of or in 
                  connection with the information provided on this platform.
                </p>
                <p>
                  GharBazaar makes no representations or warranties regarding the accuracy, reliability, completeness, 
                  or timeliness of any information on this platform.
                </p>
              </div>
            </section>

            {/* Section 2: Platform Role */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Platform Role and Limitations</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  GharBazaar acts solely as an intermediary platform connecting property buyers and sellers. We:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Do not own, sell, or purchase any properties listed on our platform</li>
                  <li>Are not real estate agents, brokers, or dealers</li>
                  <li>Do not participate in property transactions</li>
                  <li>Do not guarantee the completion of any property transaction</li>
                  <li>Are not responsible for the conduct of users on our platform</li>
                </ul>
              </div>
            </section>

            {/* Section 3: Property Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="text-green-600 dark:text-green-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">3. Property Information Accuracy</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Property information, including but not limited to descriptions, prices, photographs, and specifications, 
                  is provided by property owners, sellers, or their representatives. We:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Do not verify the accuracy of property information</li>
                  <li>Are not responsible for any errors or omissions in property listings</li>
                  <li>Do not guarantee that properties are available for sale or rent</li>
                  <li>Recommend independent verification of all property details</li>
                  <li>Are not liable for any decisions made based on property information</li>
                </ul>
              </div>
            </section>

            {/* Section 4: User Verification */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600 dark:text-purple-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">4. User Identity and Credentials</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  We do not verify the identity, credentials, or background of users on our platform. Users are responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Conducting their own due diligence on other users</li>
                  <li>Verifying the identity and credentials of potential buyers or sellers</li>
                  <li>Ensuring the legitimacy of property ownership claims</li>
                  <li>Taking appropriate precautions when meeting or transacting with other users</li>
                  <li>Reporting suspicious or fraudulent activity</li>
                </ul>
              </div>
            </section>

            {/* Section 5: Financial and Legal Advice */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Scale className="text-yellow-600 dark:text-yellow-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">5. No Financial or Legal Advice</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Information provided on our platform does not constitute financial, legal, tax, or investment advice. We:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Do not provide professional advice of any kind</li>
                  <li>Recommend consulting qualified professionals before making property decisions</li>
                  <li>Are not responsible for any financial losses or legal issues</li>
                  <li>Do not guarantee investment returns or property appreciation</li>
                  <li>Advise users to seek independent professional advice</li>
                </ul>
              </div>
            </section>

            {/* Section 6: Market Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                  <Eye className="text-indigo-600 dark:text-indigo-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">6. Market Data and Analytics</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Market data, price trends, and analytics provided on our platform are for informational purposes only:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Data may not be real-time or completely accurate</li>
                  <li>Market conditions can change rapidly</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Regional variations may not be fully reflected</li>
                  <li>Users should verify data independently</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Third-Party Services */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                  <Globe className="text-teal-600 dark:text-teal-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">7. Third-Party Services and Links</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Our platform may contain links to third-party websites or integrate with third-party services:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We are not responsible for third-party content or services</li>
                  <li>Third-party terms and conditions apply to their services</li>
                  <li>We do not endorse or guarantee third-party services</li>
                  <li>Users access third-party services at their own risk</li>
                  <li>Privacy policies of third parties may differ from ours</li>
                </ul>
              </div>
            </section>

            {/* Section 8: Limitation of Liability */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <Shield className="text-red-600 dark:text-red-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">8. Limitation of Liability</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  To the maximum extent permitted by law, GharBazaar shall not be liable for any:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Direct, indirect, incidental, or consequential damages</li>
                  <li>Loss of profits, revenue, or business opportunities</li>
                  <li>Property transaction failures or disputes</li>
                  <li>Fraudulent activities by users</li>
                  <li>Technical issues or platform downtime</li>
                  <li>Errors in property information or market data</li>
                </ul>
                <p>
                  Our total liability shall not exceed the amount paid by you for our services in the 12 months 
                  preceding the claim.
                </p>
              </div>
            </section>

            {/* Section 9: User Responsibility */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <Users className="text-cyan-600 dark:text-cyan-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">9. User Responsibility</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Users are solely responsible for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Verifying all property information independently</li>
                  <li>Conducting proper due diligence before transactions</li>
                  <li>Complying with all applicable laws and regulations</li>
                  <li>Obtaining necessary permits and approvals</li>
                  <li>Seeking professional advice when needed</li>
                  <li>Protecting their personal and financial information</li>
                  <li>Using the platform in accordance with our terms</li>
                </ul>
              </div>
            </section>

            {/* Section 10: Regulatory Compliance */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <Building2 className="text-violet-600 dark:text-violet-400" size={18} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">10. Regulatory and Legal Compliance</h3>
              </div>
              <div className="ml-11 space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  Real estate transactions are subject to various laws and regulations:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>RERA (Real Estate Regulation and Development Act) compliance</li>
                  <li>Local municipal and state regulations</li>
                  <li>Tax implications and stamp duty requirements</li>
                  <li>Environmental and building code compliance</li>
                  <li>Title verification and legal documentation</li>
                </ul>
                <p>
                  Users must ensure compliance with all applicable laws and regulations. We recommend 
                  consulting legal and financial professionals before proceeding with any transaction.
                </p>
              </div>
            </section>

            {/* Important Notice */}
            <section className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="text-red-600 dark:text-red-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Important Notice</h3>
                  <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
                    This disclaimer is subject to change without notice. Users are advised to review this disclaimer 
                    periodically. Continued use of the platform after changes constitutes acceptance of the updated disclaimer.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Questions About This Disclaimer</h3>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>If you have any questions about this disclaimer, please contact us:</p>
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