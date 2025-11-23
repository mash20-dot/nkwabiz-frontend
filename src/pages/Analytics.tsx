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
import {
  getSalesHistory,
  getMonthlySalesSummary,
  SaleHistoryItem,
} from "../utils/salesApi";
import { getToken } from "../utils/api";
import Button from "../components/Button";
import { formatCurrency } from "../utils/currencyUtils";

const Analytics = () => {
  const [salesData, setSalesData] = useState<SaleHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("week");
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    getSalesHistory()
      .then((data) =>
        setSalesData(
          Array.isArray(data.sales_history) ? data.sales_history : []
        )
      )
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
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Analytics</h1>
        <div className="flex gap-[1rem]">
          <Button
            className="bg-blue-600 border-blue-600 text-white"
            onClick={exportReport}
            disabled={exportLoading}
          >
            <Download className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
            {exportLoading ? "Exporting..." : "Export Report"}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {exportError && <div className="text-red-500">{exportError}</div>}

      {/* Analytics Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Total Sales</div>
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(totalSales)}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Transactions</div>
          <div className="text-2xl font-semibold text-gray-800">
            {totalTransactions}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Products Sold</div>
          <div className="text-2xl font-semibold text-gray-800">
            {productsSold}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Avg. Sale Value</div>
          <div className="text-2xl font-semibold text-gray-800">
            {formatCurrency(avgSaleValue)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <span className="font-medium text-gray-800">Sales Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="font-medium text-gray-800">Top Products</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProductsData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#2563eb" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;