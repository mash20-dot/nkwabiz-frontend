import React, { useEffect, useState } from "react";
import {
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Package,
  ShoppingCart,
} from "lucide-react";
import SummaryCard from "../components/SummaryCard";
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
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
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
        // Format as "Today, HH:MM AM/PM"
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

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <SaleModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        products={products}
      />
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Dashboard</h1>
        <div className="flex gap-[1rem]">
          <Button onClick={() => setSaleModalOpen(true)}>
            <ShoppingCart
              className="h-4 w-4 mr-2 text-gray-600"
              aria-hidden="true"
            />
            Add Sale
          </Button>
          <Button
            className="bg-blue-600 border-blue-600 text-white"
            onClick={() => navigate("/products?add=true")}
          >
            <Package className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
            Add New Product
          </Button>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Sales Today Card */}
        <SummaryCard
          linkPath="/sales"
          title="Sales Today"
          linkLabel="View all"
          icon={DollarSign}
          iconColor="text-green-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">
            {loadingSalesToday
              ? "..."
              : salesToday !== null
              ? `₵${salesToday.toLocaleString()}`
              : "₵0"}
          </div>
        </SummaryCard>

        {/* Total Products Card */}
        <SummaryCard
          linkPath="/products"
          title="Total Products"
          linkLabel="View all"
          icon={Package}
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">
            {loadingProducts ? "..." : totalProducts}
          </div>
        </SummaryCard>

        {/* Low Stock Items Card */}
        <SummaryCard
          linkPath="/products"
          title="Low Stock Items"
          linkLabel="View details"
          icon={AlertTriangle}
          iconColor="text-yellow-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">
            {loadingProducts ? "..." : lowStockItems.length}
          </div>
        </SummaryCard>

        {/* Sales This Month Card */}
        <SummaryCard
          linkPath="/analytics"
          title="Sales This Month"
          linkLabel="View analytics"
          icon={TrendingUp}
          iconColor="text-indigo-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">
            {monthlyLoading ? (
              "..."
            ) : monthlyError ? (
              <span className="text-sm text-red-500">{monthlyError}</span>
            ) : monthlySales !== null ? (
              `₵${monthlySales.toLocaleString()}`
            ) : (
              "₵0"
            )}
          </div>
          {!monthlyLoading && monthlyProfit !== null && (
            <div className="text-xs text-gray-500">
              Profit: ₵{monthlyProfit.toLocaleString()}
            </div>
          )}
        </SummaryCard>
      </div>
      <div className="w-full grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Sales -- updated for real API data */}
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
                          ₵{sale.total_price?.toLocaleString()}
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
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.remaining_stock === 0
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
