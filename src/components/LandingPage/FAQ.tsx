import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(0);
  const faqs = [{
    question: 'How easy is it to get started with NkwaBiz?',
    answer: 'Getting started with NkwaBiz is simple! Sign up for an account, input your basic business information, and you can start adding your inventory immediately. Most businesses are fully set up within a day, and our support team is available to help you with the onboarding process.'
  }, {
    question: 'Do I need internet access to use NkwaBiz?',
    answer: "NkwaBiz works best with internet access, but we understand connectivity challenges in some areas. Our system has offline capabilities that allow you to record sales and update inventory even without an internet connection. Once you're back online, the data will automatically sync with your account."
  }, {
    question: 'Can NkwaBiz work for different types of businesses?',
    answer: 'Yes! NkwaBiz is designed to be flexible and works for various business types including retail shops, grocery stores, pharmacies, hardware stores, clothing boutiques, and more. The platform can be customized to meet your specific business needs.'
  }, {
    question: 'Is my business data secure with NkwaBiz?',
    answer: 'Absolutely. We take data security very seriously. All your business information is encrypted and stored securely. We implement industry-standard security protocols to ensure your data is protected at all times.'
  }, {
    question: 'Can multiple staff members use the system?',
    answer: 'Yes, NkwaBiz supports multiple user accounts with different permission levels. You can add staff members and control what they can view or edit in the system. This allows you to delegate responsibilities while maintaining oversight of your business operations.'
  }, {
    question: 'Is there training available for me and my staff?',
    answer: 'We provide comprehensive training resources including video tutorials, user guides, and live support. Additionally, we offer personalized training sessions to help you and your team get the most out of NkwaBiz.'
  }];
  return <div id="faq" className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
            Frequently Asked Questions
          </h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
            Common questions about NkwaBiz
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Everything you need to know about using our business management
            platform.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button className="w-full px-6 py-4 flex justify-between items-center bg-white hover:bg-gray-50 focus:outline-none" onClick={() => setOpenQuestion(openQuestion === index ? null : index)}>
                <span className="text-lg font-medium text-gray-900 text-left">
                  {faq.question}
                </span>
                <span className="ml-6 flex-shrink-0">
                  {openQuestion === index ? <ChevronUp className="h-5 w-5 text-blue-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </span>
              </button>
              {openQuestion === index && <div className="px-6 py-4 bg-gray-50">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>}
            </div>)}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="#" className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Contact our support team
          </a>
        </div>
      </div>
    </div>;
};
export default FAQ;