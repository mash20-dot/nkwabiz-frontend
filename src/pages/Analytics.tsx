import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Download, Calendar } from "lucide-react";
import { getSalesHistory, SaleHistoryItem } from "../utils/salesApi";
import { getToken } from "../utils/api";

const Analytics = () => {
  const [salesData, setSalesData] = useState<SaleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week");
  const [exportLoading, setExportLoading] = useState(false); // add loading for export
  const [exportError, setExportError] = useState<string>(""); // error for export

  useEffect(() => {
    setLoading(true);
    getSalesHistory()
      .then((data) => setSalesData(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message || "Failed to fetch analytics"))
      .finally(() => setLoading(false));
  }, []);

  // Analytics calculations
  const totalSales = salesData.reduce(
    (sum, item) => sum + (item.total_price || 0),
    0
  );
  const totalTransactions = salesData.length;
  const avgSaleValue = totalTransactions ? totalSales / totalTransactions : 0;
  const productsSold = salesData.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );

  // Sales Trend Data
  const salesByDate: { [date: string]: number } = {};
  salesData.forEach((item) => {
    const day = new Date(item.date).toLocaleDateString();
    salesByDate[day] = (salesByDate[day] || 0) + (item.total_price || 0);
  });
  const chartData = Object.entries(salesByDate).map(([name, sales]) => ({
    name,
    sales,
  }));

  // Top Products Data
  const topProductsMap: { [name: string]: number } = {};
  salesData.forEach((item) => {
    topProductsMap[item.product_name] =
      (topProductsMap[item.product_name] || 0) + (item.quantity || 0);
  });
  const topProductsData = Object.entries(topProductsMap)
    .map(([name, sales]) => ({ name, sales }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  // ---- Export Excel Handler ----
  async function exportReport() {
    setExportLoading(true);
    setExportError("");
    try {
      const token = getToken();
      if (!token) {
        setExportError("Not authenticated. Please log in.");
        setExportLoading(false);
        return;
      }
      const response = await fetch("/excel_export/export/excel", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let msg = "Export failed.";
        try {
          const data = await response.json();
          if (data?.message) msg = data.message;
        } catch {
          // response not JSON (might be HTML error)
        }
        setExportError(msg);
        setExportLoading(false);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setExportError(err?.message || "Export failed.");
    }
    setExportLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={exportReport}
          disabled={exportLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          {exportLoading ? "Exporting..." : "Export Report"}
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      {exportError && <div className="text-red-500">{exportError}</div>}
      {/* Date Range Selector */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Time Period:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setDateRange("week")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "week"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 border border-gray-300"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange("month")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "month"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 border border-gray-300"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange("year")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "year"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700 border border-gray-300"
              }`}
            >
              This Year
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Custom date range..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
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
                    ₵{totalSales.toLocaleString()}
                  </dd>
                </dl>
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
                    {totalTransactions}
                  </dd>
                </dl>
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
                    ₵
                    {avgSaleValue.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </dd>
                </dl>
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
                    Products Sold
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {productsSold}
                  </dd>
                </dl>
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
            <LineChart
              width={500}
              height={300}
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`₵${value}`, "Sales"]} />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                activeDot={{
                  r: 8,
                }}
                name="Sales (₵)"
              />
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
            <BarChart
              width={500}
              height={300}
              data={topProductsData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
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
    </div>
  );
};
export default Analytics;
