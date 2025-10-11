import React from 'react';
import { Clipboard, Layers, Zap, ArrowRight } from 'lucide-react';
const HowItWorks = () => {
  const steps = [{
    title: 'Set up your inventory',
    description: 'Add your products, set stock levels, and configure pricing in just a few clicks.',
    icon: Clipboard
  }, {
    title: 'Record daily transactions',
    description: 'Easily log sales, track which products are moving, and manage your cash flow.',
    icon: Layers
  }, {
    title: 'Gain business insights',
    description: 'Access powerful analytics to understand trends and make informed decisions.',
    icon: Zap
  }];
  return <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            How NkwaBiz Works
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            Simple steps to transform your business
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Get started in minutes and see results immediately with our
            intuitive business management platform.
          </p>
        </div>
        <div className="mt-16">
          <div className="flex flex-col md:flex-row gap-8 md:gap-4 relative">
            {steps.map((step, index) => <div key={index} className="flex-1 relative">
                <div className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-100 h-full">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mb-5">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-blue-500" />
                  </div>}
              </div>)}
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Our platform is designed to grow with your business, from a single
              shop to multiple locations.
            </p>
            <a href="/about" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              Learn more about NkwaBiz
            </a>
          </div>
        </div>
      </div>
    </div>;
};
export default HowItWorks;