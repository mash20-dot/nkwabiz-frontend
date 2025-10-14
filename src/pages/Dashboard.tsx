import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart2,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardOverview } from '../utils/productApi';
import { getStockAlerts } from '../utils/stockApi';
import SaleModal from '../components/SaleModal';

type DashboardProduct = {
  product_name: string;
  selling_price: number;
  initial_stock: number;
  expiration_date: string;
  remaining_stock: number;
};

const Dashboard = () => {
  // Product overview
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Premium Stock Alerts
  const [stockAlerts, setStockAlerts] = useState<{product_name: string, remaining_stock: number, message: string}[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [premiumError, setPremiumError] = useState("");

  // Sale Modal
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoadingProducts(true);
    getDashboardOverview()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    setLoadingAlerts(true);
    getStockAlerts()
      .then(res => setStockAlerts(res.alert || []))
      .catch(err => {
        // If premium error, show fallback
        if (err.message?.includes("premium")) setPremiumError(err.message);
        setStockAlerts([]);
      })
      .finally(() => setLoadingAlerts(false));
  }, []);

  // Stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(p =>
    typeof p.remaining_stock === 'number' &&
    typeof p.initial_stock === 'number' &&
    p.remaining_stock <= Math.max(5, Math.floor(p.initial_stock * 0.1))
  );

  return (
    <div className="space-y-6">
      <SaleModal open={saleModalOpen} onClose={() => setSaleModalOpen(false)} products={products} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales Today Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sales Today
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ₵1,200 {/* Dummy data */}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/sales" className="font-medium text-blue-700 hover:text-blue-900">
                View all
              </Link>
            </div>
          </div>
        </div>
        {/* Total Products Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Products
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loadingProducts ? '...' : totalProducts}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/products" className="font-medium text-blue-700 hover:text-blue-900">
                View all
              </Link>
            </div>
          </div>
        </div>
        {/* Low Stock Items Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Stock Items
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {loadingProducts ? '...' : lowStockItems.length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/products" className="font-medium text-blue-700 hover:text-blue-900">
                View details
              </Link>
            </div>
          </div>
        </div>
        {/* Sales This Month Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sales This Month
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      ₵32,500 {/* Dummy data */}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/analytics" className="font-medium text-blue-700 hover:text-blue-900">
                View analytics
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Sales
            </h3>
            <Link to="/sales" className="text-sm font-medium text-blue-700 hover:text-blue-900">
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { product: 'Rice (5kg)', quantity: 10, amount: '₵500', date: 'Today, 2:30 PM' },
                    { product: 'Cooking Oil', quantity: 5, amount: '₵250', date: 'Today, 1:15 PM' },
                    { product: 'Sugar (1kg)', quantity: 8, amount: '₵160', date: 'Today, 11:20 AM' },
                    { product: 'Milk Powder', quantity: 3, amount: '₵90', date: 'Today, 10:45 AM' },
                  ].map((sale, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.product}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Low Stock Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Low Stock Alerts {premiumError && <span className="text-xs text-red-400">(Premium required)</span>}
            </h3>
            <Link to="/products" className="text-sm font-medium text-blue-700 hover:text-blue-900">
              View all
            </Link>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingAlerts ? (
                    <tr><td colSpan={3} className="px-6 py-4 text-gray-500 text-center">Loading...</td></tr>
                  ) : stockAlerts.length > 0 ? stockAlerts.map((alert, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.remaining_stock}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {alert.message}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    lowStockItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-4 text-gray-500 text-center">No low stock alerts</td>
                      </tr>
                    ) : (
                      lowStockItems.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.remaining_stock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.remaining_stock === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {item.remaining_stock === 0 ? 'Critical' : 'Low'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              onClick={() => setSaleModalOpen(true)}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <ShoppingCart className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Record New Sale
                </p>
                <p className="text-sm text-gray-500">Add a new transaction</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => navigate("/products?add=true")}
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  Add New Product
                </p>
                <p className="text-sm text-gray-500">
                  Create a product listing
                </p>
              </div>
            </button>
            <Link to="/analytics" className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
              <div className="flex-shrink-0">
                <BarChart2 className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">
                  View Analytics
                </p>
                <p className="text-sm text-gray-500">
                  Check business performance
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;