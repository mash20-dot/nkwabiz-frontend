import React from 'react';
import { Save, User, Building, Bell, Lock, CreditCard } from 'lucide-react';
const Settings = () => {
  return <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:space-x-6">
            {/* Settings Navigation */}
            <div className="w-full md:w-1/4">
              <nav className="space-y-1">
                <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full">
                  <User className="text-blue-500 mr-3 h-5 w-5" />
                  <span className="truncate">Account</span>
                </button>
                {/* <button className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full">
                  <Building className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  <span className="truncate">Business Profile</span>
                </button>
                <button className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full">
                  <Bell className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  <span className="truncate">Notifications</span>
                </button>
                <button className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full">
                  <Lock className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  <span className="truncate">Security</span>
                </button>
                <button className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group rounded-md px-3 py-2 flex items-center text-sm font-medium w-full">
                  <CreditCard className="text-gray-400 group-hover:text-gray-500 mr-3 h-5 w-5" />
                  <span className="truncate">Billing</span>
                </button> */}
              </nav>
            </div>
            {/* Settings Content */}
            <div className="mt-5 md:mt-0 w-full md:w-3/4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Account Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your account details and preferences.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <div className="mt-1">
                      <input type="text" name="first-name" id="first-name" defaultValue="Sakyi" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input type="text" name="last-name" id="last-name" defaultValue="Mustapha" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="sm:col-span-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input id="email" name="email" type="email" defaultValue="sakyimustapha5@gmail.com" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone number
                    </label>
                    <div className="mt-1">
                      <input type="text" name="phone" id="phone" defaultValue="+233 55 123 4567" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" />
                    </div>
                  </div>
                </div>
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button type="button" className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Cancel
                    </button>
                    <button type="submit" className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="mt-10 pt-10 border-t border-gray-200">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Subscription Plan
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Manage your subscription and billing information.
                  </p>
                </div>
                <div className="mt-6">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CreditCard className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          You are currently on the{' '}
                          <span className="font-medium">Free Plan</span>.
                          Upgrade to Premium for full access to all features.
                        </p>
                        <p className="mt-3 text-sm md:mt-0 md:ml-6">
                          <button className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                            Upgrade <span aria-hidden="true">&rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        Premium Plan Features
                      </h4>
                    </div>
                    <div className="mt-4 space-y-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Low stock alerts
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Excel export
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Sales analytics
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          Business reports
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Settings;