import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, BarChart2, DollarSign, Package, AlertTriangle, Settings } from 'lucide-react';
const Features = () => {
  const features = [{
    name: 'Inventory Management',
    description: 'Keep track of your products, stock levels, and receive low stock alerts to ensure you never run out of essential items.',
    icon: Package
  }, {
    name: 'Sales Tracking',
    description: 'Record and monitor all sales transactions with detailed information on products, quantities, and revenue.',
    icon: ShoppingBag
  }, {
    name: 'Financial Analytics',
    description: 'Gain insights into your business performance with visual charts and reports on sales trends and revenue.',
    icon: BarChart2
  }, {
    name: 'Low Stock Alerts',
    description: 'Receive timely notifications when inventory items reach predefined threshold levels to maintain optimal stock.',
    icon: AlertTriangle
  }, {
    name: 'Revenue Monitoring',
    description: 'Track your daily, weekly, and monthly revenue with detailed breakdowns by product categories.',
    icon: DollarSign
  }, {
    name: 'Customizable Settings',
    description: 'Tailor the system to your specific business needs with flexible configuration options.',
    icon: Settings
  }];
  return <div id="features" className="py-16 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Features
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Everything you need to manage your business
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Comprehensive tools designed to help small businesses thrive in
            today's competitive market.
          </p>
        </div>
        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => <div key={feature.name} className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
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
        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Explore all features
          </Link>
        </div>
      </div>
    </div>;
};
export default Features;