import React, { useEffect, useState } from "react";
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Package,
  ShoppingCart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardOverview } from "../utils/productApi";
import { getStockAlerts } from "../utils/stockApi";
import {
  getSalesHistoryWithSummary,
  getProductsSold,
  getMonthlySalesSummary,
  MonthlySalesItem,
  MonthlySalesSummaryResponse,
} from "../utils/salesApi";
import SaleModal from "../components/SaleModal";
import Button from "../components/Button";
import { formatCurrency } from "../utils/currencyUtils";

type DashboardProduct = {
  product_name: string;
  selling_price: number;
  initial_stock: number;
  expiration_date: string;
  remaining_stock: number;
};

type RecentSale = {
  product_name: string;
  quantity: number;
  total_price: number;
  date: string;
};

// Modern Stats Card Component
const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor,
  iconColor,
  loading,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  iconBgColor: string;
  iconColor: string;
  loading?: boolean;
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
        </div>
        <div className={`${iconBgColor} p-2 sm:p-3 rounded-xl`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {loading ? "..." : value}
        </h3>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Product overview
  const [products, setProducts] = useState<DashboardProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Premium Stock Alerts
  const [stockAlerts, setStockAlerts] = useState<
    { product_name: string; remaining_stock: number; message: string }[]
  >([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [premiumError, setPremiumError] = useState("");

  // Sale Modal
  const [saleModalOpen, setSaleModalOpen] = useState(false);

  // Sales Today (from summary endpoint)
  const [salesToday, setSalesToday] = useState<number | null>(null);
  const [loadingSalesToday, setLoadingSalesToday] = useState(false);

  // Recent Sales
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [loadingRecentSales, setLoadingRecentSales] = useState(false);

  // Monthly Sales State
  const [monthlySales, setMonthlySales] = useState<number | null>(null);
  const [monthlyProfit, setMonthlyProfit] = useState<number | null>(null);
  const [monthlyLoading, setMonthlyLoading] = useState<boolean>(true);
  const [monthlyError, setMonthlyError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    setLoadingProducts(true);
    getDashboardOverview()
      .then((data) => {
        console.log("📦 Dashboard overview API response:", data);
        console.log("📦 Is array?", Array.isArray(data));
        console.log("📦 Has products?", data?.products);
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        console.log("📦 Final products array:", productsArray);
        setProducts(productsArray);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch products:", err);
        setProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    setLoadingAlerts(true);
    getStockAlerts()
      .then((res) => setStockAlerts(res.alert || []))
      .catch((err) => {
        if (err.message?.includes("premium")) setPremiumError(err.message);
        setStockAlerts([]);
      })
      .finally(() => setLoadingAlerts(false));
  }, []);

  useEffect(() => {
    setLoadingSalesToday(true);
    getSalesHistoryWithSummary()
      .then((data) => {
        if (
          data.summary &&
          typeof data.summary.total_sales_for_recent_date === "number"
        ) {
          setSalesToday(data.summary.total_sales_for_recent_date);
        }
      })
      .catch(() => setSalesToday(null))
      .finally(() => setLoadingSalesToday(false));
  }, []);

  useEffect(() => {
    setLoadingRecentSales(true);
    getProductsSold()
      .then((data: RecentSale[]) => {
        setRecentSales(Array.isArray(data) ? data : []);
      })
      .catch(() => setRecentSales([]))
      .finally(() => setLoadingRecentSales(false));
  }, []);

  useEffect(() => {
    setMonthlyLoading(true);
    setMonthlyError("");
    getMonthlySalesSummary()
      .then((response: MonthlySalesSummaryResponse) => {
        const data = response.monthly_sales_summary || [];
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const thisMonth = data.find(
          (item) => item.year === currentYear && item.month === currentMonth
        );
        if (thisMonth) {
          setMonthlySales(thisMonth.total_sales);
          setMonthlyProfit(thisMonth.total_profit);
        } else {
          setMonthlySales(0);
          setMonthlyProfit(0);
        }
      })
      .catch((err) => {
        console.error("Monthly sales fetch error:", err);
        setMonthlySales(null);
        setMonthlyProfit(null);
        setMonthlyError("Could not fetch monthly sales.");
      })
      .finally(() => setMonthlyLoading(false));
  }, []);

  // Stats
  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (p) =>
      typeof p.remaining_stock === "number" &&
      typeof p.initial_stock === "number" &&
      p.remaining_stock <= Math.max(5, Math.floor(p.initial_stock * 0.1))
  );

  // Helper: format date (as "Today, HH:MM AM/PM" if today's date)
  function formatSaleDate(dateStr: string) {
    try {
      const saleDate = new Date(dateStr);
      const today = new Date();
      if (
        saleDate.getDate() === today.getDate() &&
        saleDate.getMonth() === today.getMonth() &&
        saleDate.getFullYear() === today.getFullYear()
      ) {
        return `Today, ${saleDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      }
      return saleDate.toLocaleString();
    } catch {
      return dateStr;
    }
  }

  // Handle new sale - add to list immediately
  const handleSaleComplete = (saleData: {
    product_name: string;
    quantity: number;
    total_price: number;
    date: string;
  }) => {
    // Add new sale to the top of recent sales list
    setRecentSales(prev => [saleData, ...prev]);

    // Update sales today
    if (salesToday !== null) {
      setSalesToday(salesToday + saleData.total_price);
    } else {
      setSalesToday(saleData.total_price);
    }

    // Update monthly sales if available
    if (monthlySales !== null) {
      setMonthlySales(monthlySales + saleData.total_price);
    }
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <SaleModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        products={products}
        onSaleComplete={handleSaleComplete}
      />

      {/* Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
        <div className="flex gap-3">
          <Button onClick={() => setSaleModalOpen(true)}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add Sale
          </Button>
          <Button
            className="bg-blue-600 border-blue-600 text-white"
            onClick={() => navigate("/products?add=true")}
          >
            <Package className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Modern Stats Cards - 2x2 on mobile, 4 columns on desktop */}
      <div className="w-full grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
        {/* Sales Today */}
        <StatsCard
          title="Sales Today"
          value={salesToday !== null ? formatCurrency(salesToday) : formatCurrency(0)}
          icon={DollarSign}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
          loading={loadingSalesToday}
        />

        {/* Total Products */}
        <StatsCard
          title="Total Products"
          value={`+${totalProducts}`}
          icon={Package}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-600"
          loading={loadingProducts}
        />

        {/* Low Stock Items */}
        <StatsCard
          title="Low Stock Items"
          value={`+${lowStockItems.length}`}
          icon={AlertTriangle}
          iconBgColor="bg-yellow-50"
          iconColor="text-yellow-600"
          loading={loadingProducts}
        />

        {/* Sales This Month */}
        <StatsCard
          title="Sales This Month"
          value={
            monthlyError
              ? "Error"
              : monthlySales !== null
                ? formatCurrency(monthlySales)
                : formatCurrency(0)
          }
          subtitle={
            !monthlyLoading && monthlyProfit !== null
              ? `Profit: ${formatCurrency(monthlyProfit)}`
              : undefined
          }
          icon={TrendingUp}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
          loading={monthlyLoading}
        />
      </div>

      {/* Tables Section */}
      <div className="w-full grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Sales */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Sales
            </h3>
            <Link
              to="/sales"
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
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
                  {loadingRecentSales ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-gray-500 text-center"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : recentSales.length > 0 ? (
                    recentSales.slice(0, 10).map((sale, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sale.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sale.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(sale.total_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatSaleDate(sale.date)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-gray-500 text-center"
                      >
                        No recent sales found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Low Stock Alerts{" "}
              {premiumError && (
                <span className="text-xs text-red-400">(Premium required)</span>
              )}
            </h3>
            <Link
              to="/products"
              className="text-sm font-medium text-blue-700 hover:text-blue-900"
            >
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
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingAlerts ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-gray-500 text-center"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : stockAlerts.length > 0 ? (
                    stockAlerts.map((alert, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {alert.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {alert.remaining_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {alert.message}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : lowStockItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-gray-500 text-center"
                      >
                        No low stock alerts
                      </td>
                    </tr>
                  ) : (
                    lowStockItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.product_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.remaining_stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.remaining_stock === 0
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {item.remaining_stock === 0 ? "Critical" : "Low"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;