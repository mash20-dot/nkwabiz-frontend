import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Download, Calendar } from "lucide-react";
import { getToken, apiFetch } from "../utils/api";

// --- Types ---
type ExpenseHistoryItem = {
  expense_id?: number;
  description: string;
  amount: number;
  category?: string;
  date: string;
};

type DateRangeType = "week" | "month" | "year" | "custom";

const Analytics = () => {
  const [expensesData, setExpensesData] = useState<ExpenseHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [dateRange, setDateRange] = useState<DateRangeType>("year");
  const [customDate, setCustomDate] = useState<string>("");

  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [exportError, setExportError] = useState<string>("");

  // Helper: Convert date from "YYYY/MM/DD" to "YYYY-MM-DD" for backend
  function formatDateForBackend(dateStr: string) {
    return dateStr.replace(/\//g, "-");
  }

  // Build query params based on filter
  function buildQueryParams(): string {
    const today = new Date();
    if (dateRange === "year") {
      return `?year=${today.getFullYear()}`;
    } else if (dateRange === "month") {
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    } else if (dateRange === "custom" && customDate) {
      return `?date=${formatDateForBackend(customDate)}`;
    } else if (dateRange === "week") {
      // If BE supports week param, send it. If not, fetch month and filter below.
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    }
    return "";
  }

  // Fetch expenses data from backend and filter for "week" in frontend if needed
  const fetchExpensesData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const params = buildQueryParams();
      const data = await apiFetch(
        `/expenses/track${params}`,
        { method: "GET" },
        true
      );

      // Use only filtered response for analytics
      let items: ExpenseHistoryItem[] = Array.isArray(data.expenses_history)
        ? data.expenses_history
        : [];

      // Filter for week in frontend if necessary
      if (dateRange === "week") {
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        items = items.filter((item: ExpenseHistoryItem) => {
          const d = new Date(item.date);
          return d >= start && d <= end;
        });
      }

      setExpensesData(items);
    } catch (err: any) {
      setError(
        err?.message ||
          "Failed to fetch analytics. Please check your API endpoint and filtering support."
      );
      setExpensesData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpensesData();
    // eslint-disable-next-line
  }, [dateRange, customDate]);

  // ---- Analytics calculations (based only on filtered expensesData) ----
  const totalExpenses = expensesData.reduce(
    (sum: number, item: ExpenseHistoryItem) => sum + (item.amount || 0),
    0
  );
  const totalTransactions = expensesData.length;
  const avgExpenseValue = totalTransactions
    ? totalExpenses / totalTransactions
    : 0;
  const productsSold = expensesData.length; // Or use categories if needed

  // Expense Trend Data (filtered)
  const expensesByDate: { [date: string]: number } = {};
  expensesData.forEach((item: ExpenseHistoryItem) => {
    const day = new Date(item.date).toLocaleDateString();
    expensesByDate[day] = (expensesByDate[day] || 0) + (item.amount || 0);
  });
  const chartData = Object.entries(expensesByDate).map(([name, total]) => ({
    name,
    total,
  }));

  // Top Expense Categories (filtered)
  const topCategoriesMap: { [name: string]: number } = {};
  expensesData.forEach((item: ExpenseHistoryItem) => {
    const cat = item.category || "Uncategorized";
    topCategoriesMap[cat] = (topCategoriesMap[cat] || 0) + (item.amount || 0);
  });
  const topCategoriesData = Object.entries(topCategoriesMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
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

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let msg = "Export failed.";
        try {
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data?.message) msg = data.message;
          } else {
            const text = await response.text();
            msg = text;
          }
        } catch {
          // ignore
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
      {/* Header and Export */}
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
              onClick={() => {
                setDateRange("year");
                setCustomDate("");
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "year"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              This Year
            </button>
            <button
              onClick={() => {
                setDateRange("month");
                setCustomDate("");
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "month"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => {
                setDateRange("week");
                setCustomDate("");
              }}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "week"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateRange("custom")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                dateRange === "custom"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Choose Date
            </button>
            {dateRange === "custom" && (
              <input
                type="date"
                className="px-2 py-1 border rounded"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            )}
          </div>
        </div>
      </div>
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Total Expenses</div>
          <div className="text-2xl font-semibold text-gray-800">
            ₦{totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Transactions</div>
          <div className="text-2xl font-semibold text-gray-800">
            {totalTransactions}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Entries</div>
          <div className="text-2xl font-semibold text-gray-800">
            {productsSold}
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Avg. Expense Value</div>
          <div className="text-2xl font-semibold text-gray-800">
            ₦
            {avgExpenseValue.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trend */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <span className="font-medium text-gray-800">Expense Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Top Categories */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center mb-2">
            <span className="font-medium text-gray-800">Top Categories</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCategoriesData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2563eb" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {loading && (
        <div className="py-8 text-center text-gray-500">
          Loading analytics...
        </div>
      )}
    </div>
  );
};

export default Analytics;
