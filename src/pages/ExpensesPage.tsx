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
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { apiFetch, getToken } from "../utils/api";
import Button from "../components/Button";
import { Plus, X } from "lucide-react";

// --- Types ---
type ExpenseHistoryItem = {
  expense_id?: number;
  description: string;
  amount: number;
  category?: string;
  date: string;
};

type DateRangeType = "week" | "month" | "year" | "custom";

type GroupedExpenses = {
  [category: string]: ExpenseHistoryItem[];
};

const ExpensesPage: React.FC = () => {
  const [expensesData, setExpensesData] = useState<ExpenseHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [dateRange, setDateRange] = useState<DateRangeType>("year");
  const [customDate, setCustomDate] = useState<string>("");

  const [isAddingNewCategory, setIsAddingNewCategory] = useState<boolean>(false);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState<boolean>(false);
  const [addError, setAddError] = useState<string>("");

  // Add form state
  const [amountInput, setAmountInput] = useState<string>("");
  const [descriptionInput, setDescriptionInput] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const isInitialMount = useRef<boolean>(true);

  function normalizeExpensesResponse(data: any): ExpenseHistoryItem[] {
    if (!data) return [];
    if (Array.isArray(data)) return data as ExpenseHistoryItem[];
    if (Array.isArray(data.expenses_history)) return data.expenses_history;
    if (Array.isArray((data as any).history)) return (data as any).history;
    return [];
  }

  function buildFilterParams(): string {
    const today = new Date();
    if (dateRange === "year") {
      return `?year=${today.getFullYear()}`;
    }
    if (dateRange === "month") {
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    }
    if (dateRange === "custom" && customDate) {
      return `?date=${customDate}`;
    }
    if (dateRange === "week") {
      return `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    }
    return "";
  }

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

      if (dateRange === "week") {
        const now = new Date();
        const start = new Date(now);
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

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchFilteredExpenses();
  }, [dateRange, customDate]);

  const handleSubmitAdd = async (category: string) => {
    setAddError("");
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
      const payload = {
        description: descriptionInput.trim(),
        amount: amountNum,
        category: category,
      };
      await apiFetch(
        "/expenses/add",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );
      if (dateRange === "year") {
        await fetchAllExpenses();
      } else {
        await fetchFilteredExpenses();
      }
      setDescriptionInput("");
      setAmountInput("");
      setCategoryInput("");
      setAddingToCategory(null);
      setIsAddingNewCategory(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add expense.");
    }
    setAddSubmitting(false);
  };

  const handleSubmitNewCategory = async () => {
    setAddError("");
    if (!categoryInput.trim()) {
      setAddError("Category name is required.");
      return;
    }
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
      const payload = {
        description: descriptionInput.trim(),
        amount: amountNum,
        category: categoryInput.trim(),
      };
      await apiFetch(
        "/expenses/add",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        true
      );
      if (dateRange === "year") {
        await fetchAllExpenses();
      } else {
        await fetchFilteredExpenses();
      }
      // Auto-expand the new category
      setExpandedCategories(prev => new Set([...prev, categoryInput.trim()]));
      setDescriptionInput("");
      setAmountInput("");
      setCategoryInput("");
      setIsAddingNewCategory(false);
    } catch (err: any) {
      setAddError(err?.message || "Failed to add expense.");
    }
    setAddSubmitting(false);
  };

  const cancelAdding = () => {
    setIsAddingNewCategory(false);
    setAddingToCategory(null);
    setAddError("");
    setDescriptionInput("");
    setAmountInput("");
    setCategoryInput("");
  };

  // Group expenses by category
  const groupedExpenses: GroupedExpenses = expensesData.reduce(
    (acc: GroupedExpenses, expense) => {
      const category = expense.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(expense);
      return acc;
    },
    {}
  );

  // Sort categories alphabetically
  const sortedCategories = Object.keys(groupedExpenses).sort();

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Expand all / Collapse all
  const expandAll = () => {
    setExpandedCategories(new Set(sortedCategories));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  // Calculate totals
  const totalExpenses = expensesData.reduce(
    (sum, it) => sum + (it.amount || 0),
    0
  );
  const totalTransactions = expensesData.length;
  const avgExpense = totalTransactions ? totalExpenses / totalTransactions : 0;

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
  const topCategoriesData = sortedCategories
    .map((category) => ({
      name: category,
      total: groupedExpenses[category].reduce(
        (sum, exp) => sum + (exp.amount || 0),
        0
      ),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Expenses</h1>
        <div className="flex gap-[1rem]">
          {isAddingNewCategory ? (
            <Button
              onClick={cancelAdding}
              aria-expanded={isAddingNewCategory}
            >
              <X className="h-4 w-4 mr-2 text-gray-700" aria-hidden="true" />
              Cancel
            </Button>
          ) : (
            <Button
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
              onClick={() => setIsAddingNewCategory(true)}
              aria-expanded={isAddingNewCategory}
            >
              <Plus className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
              New Category
            </Button>
          )}
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Add New Category form */}
      {isAddingNewCategory && (
        <div className="w-full bg-white shadow rounded-lg p-4 border-2 border-blue-200">
          <h3 className="font-medium text-gray-900 mb-3">Create New Category</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                className="border p-2 rounded"
                placeholder="Category name (e.g., Food, Transport)"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="First expense description"
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Amount"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                type="number"
                step="0.01"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmitNewCategory}
                disabled={addSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {addSubmitting ? "Creating..." : "Create Category"}
              </button>
              <button
                onClick={cancelAdding}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
            </div>
            {addError && <div className="text-red-500">{addError}</div>}
          </div>
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
              className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === "year"
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
              className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === "month"
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
              className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === "week"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
                }`}
            >
              This Week
            </button>

            <button
              onClick={() => setDateRange("custom")}
              className={`px-3 py-1 text-sm font-medium rounded-md ${dateRange === "custom"
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
          <div className="text-gray-500 text-sm">Categories</div>
          <div className="text-2xl font-semibold text-gray-800">
            {sortedCategories.length}
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

      {/* Grouped Expenses by Category */}
      <div className="w-full bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-800">
            Expenses by Category
          </h2>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
            >
              Collapse All
            </button>
          </div>
        </div>

        {sortedCategories.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No expenses found. Create your first category to get started!
          </div>
        ) : (
          <div className="space-y-2">
            {sortedCategories.map((category) => {
              const categoryExpenses = groupedExpenses[category];
              const categoryTotal = categoryExpenses.reduce(
                (sum, exp) => sum + (exp.amount || 0),
                0
              );
              const isExpanded = expandedCategories.has(category);
              const isAddingHere = addingToCategory === category;

              return (
                <div key={category} className="border rounded-lg">
                  {/* Category Header */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-3 flex-1"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {category}
                        </div>
                        <div className="text-sm text-gray-500">
                          {categoryExpenses.length} expense
                          {categoryExpenses.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          ₵{categoryTotal.toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddingToCategory(category);
                          setIsAddingNewCategory(false);
                        }}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Add Expense to This Category Form */}
                  {isAddingHere && (
                    <div className="border-t bg-green-50 p-4">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            className="border p-2 rounded"
                            placeholder="Description"
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                          />
                          <input
                            className="border p-2 rounded"
                            placeholder="Amount"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            type="number"
                            step="0.01"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSubmitAdd(category)}
                            disabled={addSubmitting}
                            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                          >
                            {addSubmitting ? "Adding..." : "Add to " + category}
                          </button>
                          <button
                            onClick={cancelAdding}
                            className="px-4 py-2 border rounded"
                          >
                            Cancel
                          </button>
                        </div>
                        {addError && <div className="text-red-500">{addError}</div>}
                      </div>
                    </div>
                  )}

                  {/* Category Expenses */}
                  {isExpanded && (
                    <div className="border-t">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Date
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase">
                              Description
                            </th>
                            <th className="p-3 text-right text-xs font-medium text-gray-500 uppercase">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {categoryExpenses.map((exp) => (
                            <tr
                              key={
                                exp.expense_id ?? `${exp.date}-${exp.amount}`
                              }
                              className="hover:bg-gray-50"
                            >
                              <td className="p-3 text-sm text-gray-600">
                                {new Date(exp.date).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                {exp.description}
                              </td>
                              <td className="p-3 text-sm text-gray-900 text-right">
                                ₵{(exp.amount || 0).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
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