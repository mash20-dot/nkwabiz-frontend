import React from 'react';
import { Link } from 'react-router-dom';
const CTA = () => {
  return <div id="pricing" className="bg-blue-700">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">Ready to streamline your business?</span>
          <span className="block">Start using NkwaBiz today.</span>
        </h2>
        <p className="mt-4 text-lg leading-6 text-blue-200">
          Join hundreds of small business owners who have transformed their
          operations with our simple yet powerful management system.
        </p>
        <div className="mt-10 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10 sm:pb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-medium text-gray-900">
                Standard Plan
              </h3>
              <span className="px-3 py-1 text-sm font-semibold tracking-wide text-blue-800 bg-blue-100 rounded-full">
                Most Popular
              </span>
            </div>
            <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900">
              ₵99
              <span className="ml-1 text-2xl font-medium text-gray-500">
                /month
              </span>
            </div>
            <p className="mt-5 text-lg text-gray-500">
              Everything you need to manage your small business effectively.
            </p>
          </div>
          <div className="px-6 pt-6 pb-8 sm:p-10">
            <ul className="space-y-4">
              {['Unlimited product listings', 'Real-time inventory tracking', 'Sales analytics dashboard', 'Low stock alerts', 'Customer management', 'Monthly reports', 'Mobile access'].map((feature, index) => <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">{feature}</p>
                </li>)}
            </ul>
            <div className="mt-8">
              <Link to="/login" className="block w-full bg-blue-600 border border-transparent rounded-md py-3 px-5 text-center text-base font-medium text-white hover:bg-blue-700">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center">
          <Link to="/pricing" className="text-white font-medium hover:underline">
            View all pricing plans
          </Link>
          <p className="mt-3 text-base text-blue-200">
            Need a custom solution?{' '}
            <a href="#" className="font-medium text-white underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </div>;
};
export default CTA;