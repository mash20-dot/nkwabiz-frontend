import React, { useEffect, useRef, useState } from "react";
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
import { Calendar } from "lucide-react";
import { apiFetch, getToken } from "../utils/api";
import Button from "../components/Button";
import { Plus, X } from "lucide-react";

// --- Types ---
type ExpenseHistoryItem = {
  expense_id?: number;
  description: string;
  amount: number;
  category?: string;
  date: string; // backend can return ISO or RFC date strings (we parse with new Date())
};

type DateRangeType = "week" | "month" | "year" | "custom";

const ExpensesPage: React.FC = () => {
  const [expensesData, setExpensesData] = useState<ExpenseHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [dateRange, setDateRange] = useState<DateRangeType>("year");
  const [customDate, setCustomDate] = useState<string>(""); // "YYYY-MM-DD" from <input type="date" />

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addSubmitting, setAddSubmitting] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>("");

  // Add form state
  const [amountInput, setAmountInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");

  // Prevent first filter effect from running immediately after mount (we load "all" first)
  const isInitialMount = useRef<boolean>(true);

  // Utility: normalize backend responses that may be either:
  // - an array (e.g. route returns `[ ... ]`)
  // - an object with `expenses_history` or `expenses_history` field
  function normalizeExpensesResponse(data: any): ExpenseHistoryItem[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as ExpenseHistoryItem[];
    if (Array.isArray(data.expenses_history)) return data.expenses_history;
    if (Array.isArray((data as any).expenses_history))
      return (data as any).expenses_history;
    if (Array.isArray((data as any).expenses_history))
      return (data as any).expenses_history;
    // fallback: try other common keys
    if (Array.isArray((data as any).history)) return (data as any).history;
    return [];
  }

  // Build query params for /expenses/track — backend currently expects year, month or date (YYYY-MM-DD)
  function buildFilterParams(): string {
    const today = new Date();
    if (dateRange === "year") {
      return `?year=${today.getFullYear()}`;
    }
    if (dateRange === "month") {
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    }
    if (dateRange === "custom" && customDate) {
      // backend expects YYYY-MM-DD (based on your latest conversation)
      return `?date=${customDate}`;
    }
    if (dateRange === "week") {
      // backend may not support week directly — request the month and filter client-side
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    }
    return "";
  }

  // Fetch all expenses by default when the page loads
  const fetchAllExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const data = await apiFetch(
        "/expenses/track/all",
        { method: "GET" },
        true
      );
      const items = normalizeExpensesResponse(data);
      setExpensesData(items);
    } catch (err: any) {
      setError(err?.message || "Failed to load expenses.");
      setExpensesData([]);
    }
    setLoading(false);
  };

  // Fetch filtered expenses using /expenses/track
  const fetchFilteredExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Not authenticated");
      const params = buildFilterParams();
      const data = await apiFetch(
        `/expenses/track${params}`,
        { method: "GET" },
        true
      );

      let items = normalizeExpensesResponse(data);

      // If week filter is selected, filter client-side to the current week
      if (dateRange === "week") {
        const now = new Date();
        const start = new Date(now);
        // Start of week = Sunday (setDate - day)
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        items = items.filter((itm: ExpenseHistoryItem) => {
          const d = new Date(itm.date);
          return d >= start && d <= end;
        });
      }

      setExpensesData(items);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch filtered expenses");
      setExpensesData([]);
    }
    setLoading(false);
  };

  // Initial load: show all expenses
  useEffect(() => {
    fetchAllExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When filters change, fetch filtered results (skip the initial mount since we already loaded "all")
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // For "year" you might want to either call fetchAllExpenses() (to show all) or call track?year=...
    // We'll call the filtered endpoint so the UI is consistent with the selected period.
    fetchFilteredExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, customDate]);

  // ---- Add expense handler (inline form, POST to /expenses/add) ----
  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    // basic validation
    if (!descriptionInput.trim()) {
      setAddError("Description is required.");
      return;
    }
    const amountNum = parseFloat(amountInput);
    if (isNaN(amountNum) || amountNum <= 0) {
      setAddError("Enter a valid amount greater than 0.");
      return;
    }
    setAddSubmitting(true);
    try {
      // apiFetch will attach auth header if auth=true
      const payload = {
        description: descriptionInput.trim(),
        amount: amountNum,
        category: categoryInput.trim() || undefined, // backend accepts empty category
      };
      await apiFetch(
        "/expenses/add",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );
      // refresh the list — load all (or you can call filtered endpoint depending on current filter)
      // if current filter is 'year' but user expects new item in 'all', calling fetchAllExpenses ensures it's visible
      if (dateRange === "year") {
        // backend could interpret year filter; to be safe refresh all
        await fetchAllExpenses();
      } else {
        await fetchFilteredExpenses();
      }
      // reset form
      setDescriptionInput("");
      setAmountInput("");
      setCategoryInput("");
      setIsAdding(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add expense.");
    }
    setAddSubmitting(false);
  };

  // ---- Analytics calculations (based only on current expensesData) ----
  const totalExpenses = expensesData.reduce(
    (sum, it) => sum + (it.amount || 0),
    0
  );
  const totalTransactions = expensesData.length;
  const avgExpense = totalTransactions ? totalExpenses / totalTransactions : 0;
  const entriesCount = expensesData.length;

  // Trend chart data (grouped by date)
  const expensesByDate: { [key: string]: number } = {};
  expensesData.forEach((item) => {
    const day = new Date(item.date).toLocaleDateString();
    expensesByDate[day] = (expensesByDate[day] || 0) + (item.amount || 0);
  });
  const trendChartData = Object.entries(expensesByDate).map(
    ([name, total]) => ({ name, total })
  );

  // Top categories
  const categoriesMap: { [key: string]: number } = {};
  expensesData.forEach((item) => {
    const cat = item.category || "Uncategorized";
    categoriesMap[cat] = (categoriesMap[cat] || 0) + (item.amount || 0);
  });
  const topCategoriesData = Object.entries(categoriesMap)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Expenses</h1>
        <div className="flex gap-[1rem]">
          {/* <Button
            className="bg-blue-600 border-blue-600 text-white"
            onClick={() => setIsAdding((s) => !s)}
            aria-expanded={isAdding}
          >
            {isAdding ? (
              <X className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
            ) : (
              <Plus className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
            )}
            {isAdding ? "Cancel" : "Add Expense"}
          </Button> */}

          {isAdding ? (
            <Button
              onClick={() => setIsAdding((s) => !s)}
              aria-expanded={isAdding}
            >
              <X className="h-4 w-4 mr-2 text-gray-700" aria-hidden="true" />
              Cancel
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
              onClick={() => setIsAdding((s) => !s)}
              aria-expanded={isAdding}
            >
              <Plus className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
              Add Expense
            </Button>
          )}
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Add form (inline) */}
      {isAdding && (
        <div className="w-full bg-white shadow rounded-lg p-4">
          <form onSubmit={handleSubmitAdd} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Description"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="Amount"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                type="number"
                step="0.01"
                required
              />
              <input
                className="border p-2 rounded"
                placeholder="Category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={addSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {addSubmitting ? "Adding..." : "Add Expense"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setAddError("");
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
            {addError && <div className="text-red-500">{addError}</div>}
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="w-full bg-white shadow rounded-lg p-4">
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

      {/* Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Total Expenses</div>
          <div className="text-2xl font-semibold text-gray-800">
            ₵{totalExpenses.toLocaleString()}
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
            {entriesCount}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4 text-center">
          <div className="text-gray-500 text-sm">Avg. Expense</div>
          <div className="text-2xl font-semibold text-gray-800">
            ₵
            {avgExpense.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Trend */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 text-blue-500 mr-2" />
            <span className="font-medium text-gray-800">Expense Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendChartData}>
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

      {/* Expense Table */}
      <div className="w-full bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-100">
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Category</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {expensesData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No expenses found.
                </td>
              </tr>
            ) : (
              expensesData.map((exp) => (
                <tr
                  key={exp.expense_id ?? `${exp.date}-${exp.amount}`}
                  className="border-b"
                >
                  <td className="p-2">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{exp.description}</td>
                  <td className="p-2">{exp.category || "-"}</td>
                  <td className="p-2">₵{(exp.amount || 0).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-8 text-center text-gray-500">
          Loading expenses...
        </div>
      )}
    </div>
  );
};

export default ExpensesPage;
