import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, Calendar } from 'lucide-react';
const Analytics = () => {
  const [dateRange, setDateRange] = useState('week');
  // Sample sales data for charts
  const dailySalesData = [{
    name: 'Mon',
    sales: 1200
  }, {
    name: 'Tue',
    sales: 1500
  }, {
    name: 'Wed',
    sales: 1000
  }, {
    name: 'Thu',
    sales: 1800
  }, {
    name: 'Fri',
    sales: 2000
  }, {
    name: 'Sat',
    sales: 2400
  }, {
    name: 'Sun',
    sales: 1600
  }];
  const monthlySalesData = [{
    name: 'Jan',
    sales: 25000
  }, {
    name: 'Feb',
    sales: 30000
  }, {
    name: 'Mar',
    sales: 28000
  }, {
    name: 'Apr',
    sales: 32000
  }, {
    name: 'May',
    sales: 35000
  }, {
    name: 'Jun',
    sales: 40000
  }, {
    name: 'Jul',
    sales: 42000
  }];
  const topProductsData = [{
    name: 'Rice (5kg)',
    sales: 120
  }, {
    name: 'Cooking Oil',
    sales: 85
  }, {
    name: 'Sugar (1kg)',
    sales: 70
  }, {
    name: 'Milk Powder',
    sales: 55
  }, {
    name: 'Bread',
    sales: 40
  }];
  // Select chart data based on date range
  const chartData = dateRange === 'week' ? dailySalesData : monthlySalesData;
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>
      {/* Date Range Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Time Period:</span>
          <div className="flex space-x-2">
            <button onClick={() => setDateRange('week')} className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 border border-gray-300'}`}>
              This Week
            </button>
            <button onClick={() => setDateRange('month')} className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 border border-gray-300'}`}>
              This Month
            </button>
            <button onClick={() => setDateRange('year')} className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === 'year' ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700 border border-gray-300'}`}>
              This Year
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Custom date range..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
        </div>
      </div>
      {/* Sales Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Sales
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    ₵32,500
                  </dd>
                </dl>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    ↑ 12% from last period
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Transactions
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    248
                  </dd>
                </dl>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    ↑ 8% from last period
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Sale Value
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    ₵131
                  </dd>
                </dl>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    ↑ 3% from last period
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Product Sold
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    520
                  </dd>
                </dl>
                <div className="mt-4">
                  <span className="text-green-600 text-sm font-medium">
                    ↑ 10% from last period
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sales Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart width={500} height={300} data={chartData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={value => [`₵${value}`, 'Sales']} />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#3b82f6" activeDot={{
              r: 8
            }} name="Sales (₵)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Top Products */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Top Selling Products
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart width={500} height={300} data={topProductsData} margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#3b82f6" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
    </div>;
};
export default Analytics;


