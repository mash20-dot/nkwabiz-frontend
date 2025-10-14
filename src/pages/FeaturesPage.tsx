import React from 'react';
import Navbar from '../components/LandingPage/Navbar';
import Footer from '../components/LandingPage/Footer';
import { Package, ShoppingBag, BarChart2, AlertTriangle, DollarSign, Settings, Users, Clock, Database, Smartphone, Shield, Zap } from 'lucide-react';
const FeaturesPage = () => {
  const coreFeatures = [{
    name: 'Inventory Management',
    description: 'Keep track of your products, stock levels, and receive low stock alerts to ensure you never run out of essential items.',
    icon: Package,
    details: ['Track unlimited products and categories', 'Set reorder points and receive alerts', 'Monitor product performance and turnover', 'Barcode scanning capability', 'Batch inventory updates']
  }, {
    name: 'Sales Tracking',
    description: 'Record and monitor all sales transactions with detailed information on products, quantities, and revenue.',
    icon: ShoppingBag,
    details: ['Easy point-of-sale interface', 'Record sales with multiple payment methods', 'Apply discounts and promotions', 'Print or email receipts', 'Track sales by employee']
  }, {
    name: 'Financial Analytics',
    description: 'Gain insights into your business performance with visual charts and reports on sales trends and revenue.',
    icon: BarChart2,
    details: ['Daily, weekly, monthly sales reports', 'Revenue breakdown by product category', 'Profit margin analysis', 'Year-over-year comparison', 'Exportable reports for accounting']
  }, {
    name: 'Low Stock Alerts',
    description: 'Receive timely notifications when inventory items reach predefined threshold levels to maintain optimal stock.',
    icon: AlertTriangle,
    details: ['Customizable threshold levels', 'Email and in-app notifications', 'Prioritized low stock dashboard', 'One-click reorder functionality', 'Seasonal threshold adjustments']
  }, {
    name: 'Revenue Monitoring',
    description: 'Track your daily, weekly, and monthly revenue with detailed breakdowns by product categories.',
    icon: DollarSign,
    details: ['Real-time revenue dashboard', 'Cash flow tracking', 'Revenue forecasting', 'Goal setting and tracking', 'Revenue comparison across time periods']
  }, {
    name: 'Customizable Settings',
    description: 'Tailor the system to your specific business needs with flexible configuration options.',
    icon: Settings,
    details: ['Custom user permissions', 'Business profile customization', 'Tax rate settings', 'Currency and language preferences', 'Receipt and invoice customization']
  }];
  const additionalFeatures = [{
    name: 'Customer Management',
    description: 'Build stronger relationships by tracking customer information, purchase history, and preferences.',
    icon: Users
  }, {
    name: 'Offline Mode',
    description: 'Continue operating during internet outages with our offline capabilities that sync when connection is restored.',
    icon: Zap
  }, {
    name: 'Data Backup',
    description: 'Rest easy knowing your business data is automatically backed up and secured in the cloud.',
    icon: Database
  }, {
    name: 'Mobile Access',
    description: 'Manage your business on the go with our mobile-friendly interface that works on any device.',
    icon: Smartphone
  }, {
    name: 'Data Security',
    description: 'Your business information is protected with industry-standard encryption and security protocols.',
    icon: Shield
  }, {
    name: 'Time-Saving Automation',
    description: 'Automate routine tasks like inventory updates, low stock alerts, and report generation.',
    icon: Clock
  }];
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-blue-700 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              Powerful Features for Your Business
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
              Discover all the tools NkwaBiz offers to help you manage and grow
              your business.
            </p>
          </div>
        </div>
        {/* Core Features */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                Core Features
              </h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                Everything you need to succeed
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Our comprehensive suite of tools is designed to handle all
                aspects of your business operations.
              </p>
            </div>
            <div className="mt-16">
              {coreFeatures.map((feature, index) => <div key={feature.name} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} overflow-hidden`}>
                  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 lg:py-16">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                      <div className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                        <div className="mt-10 lg:mt-0 flex justify-center">
                          <div className="bg-blue-100 rounded-full p-16">
                            <feature.icon className="h-24 w-24 text-blue-600" />
                          </div>
                        </div>
                      </div>
                      <div className={`${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
                        <div className="mt-10 lg:mt-0">
                          <h3 className="text-2xl font-extrabold text-gray-900">
                            {feature.name}
                          </h3>
                          <p className="mt-3 text-lg text-gray-500">
                            {feature.description}
                          </p>
                          <div className="mt-8">
                            <ul className="space-y-3">
                              {feature.details.map((detail, idx) => <li key={idx} className="flex items-start">
                                  <span className="flex-shrink-0 h-6 w-6 text-green-500">
                                    ✓
                                  </span>
                                  <span className="ml-3 text-base text-gray-700">
                                    {detail}
                                  </span>
                                </li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
        {/* Additional Features */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                Additional Features
              </h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                Even more ways to enhance your business
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                Beyond our core functionality, NkwaBiz offers these valuable
                features to further streamline your operations.
              </p>
            </div>
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {additionalFeatures.map(feature => <div key={feature.name} className="pt-6">
                    <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg h-full">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {feature.name}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
        {/* Feature Comparison */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                Feature Comparison
              </h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                NkwaBiz vs. Traditional Methods
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                See how our platform compares to traditional business management
                methods.
              </p>
            </div>
            <div className="mt-12 overflow-hidden">
              <div className="relative max-w-3xl mx-auto">
                <table className="w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                        Feature
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900">
                        NkwaBiz
                      </th>
                      <th scope="col" className="py-3.5 px-3 text-center text-sm font-semibold text-gray-900">
                        Paper Ledgers
                      </th>
                      <th scope="col" className="py-3.5 pl-3 pr-4 text-center text-sm font-semibold text-gray-900 sm:pr-0">
                        Spreadsheets
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[{
                    name: 'Real-time inventory tracking',
                    nkwabiz: true,
                    paper: false,
                    spreadsheet: false
                  }, {
                    name: 'Automated low stock alerts',
                    nkwabiz: true,
                    paper: false,
                    spreadsheet: false
                  }, {
                    name: 'Sales analytics',
                    nkwabiz: true,
                    paper: false,
                    spreadsheet: 'Limited'
                  }, {
                    name: 'Multiple user access',
                    nkwabiz: true,
                    paper: 'Limited',
                    spreadsheet: 'Limited'
                  }, {
                    name: 'Mobile access',
                    nkwabiz: true,
                    paper: false,
                    spreadsheet: 'Limited'
                  }, {
                    name: 'Data backup',
                    nkwabiz: 'Automatic',
                    paper: false,
                    spreadsheet: 'Manual'
                  }, {
                    name: 'Time required',
                    nkwabiz: 'Minutes/day',
                    paper: 'Hours/day',
                    spreadsheet: 'Hours/day'
                  }, {
                    name: 'Error prevention',
                    nkwabiz: 'High',
                    paper: 'Low',
                    spreadsheet: 'Medium'
                  }].map(item => <tr key={item.name}>
                        <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                          {item.name}
                        </td>
                        <td className="py-4 px-3 text-sm text-center text-gray-500">
                          {typeof item.nkwabiz === 'boolean' ? item.nkwabiz ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span> : item.nkwabiz}
                        </td>
                        <td className="py-4 px-3 text-sm text-center text-gray-500">
                          {typeof item.paper === 'boolean' ? item.paper ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span> : item.paper}
                        </td>
                        <td className="py-4 pl-3 pr-4 text-sm text-center text-gray-500 sm:pr-0">
                          {typeof item.spreadsheet === 'boolean' ? item.spreadsheet ? <span className="text-green-600">✓</span> : <span className="text-red-600">✗</span> : item.spreadsheet}
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* CTA */}
        <div className="bg-blue-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to transform your business?</span>
              <span className="block text-blue-200">
                Get started with NkwaBiz today.
              </span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <a href="/login" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                  Get started
                </a>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <a href="/pricing" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900">
                  View pricing
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default FeaturesPage;