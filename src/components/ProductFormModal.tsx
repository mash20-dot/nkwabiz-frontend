import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Product } from "../utils/productApi";
import { CATEGORY_LIST, getAutoCategory } from "../utils/categories";

export default function ProductFormModal({
  open, onClose, onSubmit, initialData = {}, mode = "create", loading, error,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<Product>;
  mode: "create" | "edit";
  loading: boolean;
  error: string;
}) {
  const [form, setForm] = useState({
    product_name: initialData.product_name || "",
    selling_price: initialData.selling_price !== undefined ? String(initialData.selling_price) : "",
    amount_spent: initialData.amount_spent !== undefined ? String(initialData.amount_spent) : "",
    initial_stock: initialData.initial_stock !== undefined ? String(initialData.initial_stock) : "",
    expiration_date: initialData.expiration_date || "",
    supplier_info: initialData.supplier_info || "",
    category: initialData.category || "",
  });
  const [date, setDate] = useState<Date | null>(initialData.expiration_date ? new Date(initialData.expiration_date) : null);

  // Category dropdown logic
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(CATEGORY_LIST[5]);
  const dropdownRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setForm({
      product_name: initialData.product_name || "",
      selling_price: initialData.selling_price !== undefined ? String(initialData.selling_price) : "",
      amount_spent: initialData.amount_spent !== undefined ? String(initialData.amount_spent) : "",
      initial_stock: initialData.initial_stock !== undefined ? String(initialData.initial_stock) : "",
      expiration_date: initialData.expiration_date || "",
      supplier_info: initialData.supplier_info || "",
      category: initialData.category || "",
    });
    setDate(initialData.expiration_date ? new Date(initialData.expiration_date) : null);
    setSuggestedCategory(
      initialData.product_name
        ? getAutoCategory(initialData.product_name)
        : CATEGORY_LIST[5]
    );
  }, [open, initialData]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === "product_name") {
      setSuggestedCategory(getAutoCategory(e.target.value));
      setForm((f) => ({ ...f, category: "" }));
    }
  }
  function handleDateChange(date: Date | null) {
    setDate(date);
    setForm((f) => ({
      ...f,
      expiration_date: date ? date.toISOString().split('T')[0] : "",
    }));
  }
  function handleCategorySelect(cat: typeof CATEGORY_LIST[number]) {
    setForm(f => ({ ...f, category: cat.label }));
    setCategoryDropdownOpen(false);
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const chosenCategory = form.category || suggestedCategory.label;
    onSubmit({
      ...form,
      category: chosenCategory,
      selling_price: parseFloat(form.selling_price),
      amount_spent: parseFloat(form.amount_spent),
      initial_stock: parseInt(form.initial_stock, 10),
      expiration_date: form.expiration_date,
      supplier_info: form.supplier_info,
    });
  }
  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    }
    if (categoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownOpen]);

  if (!open) return null;
  const SelectedIcon = form.category
    ? CATEGORY_LIST.find(c => c.label === form.category)?.icon || suggestedCategory.icon
    : suggestedCategory.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 relative max-h-[90vh] overflow-y-auto">
        <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={onClose}>
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-blue-700">{mode === "create" ? "Add Product" : "Edit Product"}</h2>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input name="product_name" required placeholder="Product Name" value={form.product_name} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price</label>
              <input name="selling_price" type="number" step="0.01" required placeholder="₵0.00" value={form.selling_price} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount Spent</label>
              <input name="amount_spent" type="number" step="0.01" required placeholder="₵0.00" value={form.amount_spent} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:border-blue-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Initial Stock</label>
              <input name="initial_stock" type="number" required placeholder="Stock amount" value={form.initial_stock} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
              <DatePicker
                selected={date}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border rounded focus:border-blue-500"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date"
                minDate={new Date()}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Info</label>
            <input name="supplier_info" type="text" placeholder="Supplier Info (optional)" value={form.supplier_info} onChange={handleChange} className="w-full px-3 py-2 border rounded focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="relative">
              <button
                type="button"
                className="w-full flex items-center px-3 py-2 border rounded bg-gray-50 text-gray-700 justify-between"
                onClick={() => setCategoryDropdownOpen((open) => !open)}
              >
                <span className="flex items-center gap-2">
                  <SelectedIcon className="h-5 w-5" />
                  {form.category || suggestedCategory.label}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {categoryDropdownOpen && (
                <ul
                  ref={dropdownRef}
                  className="absolute left-0 z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-52 overflow-y-auto"
                >
                  {CATEGORY_LIST.map(cat => (
                    <li key={cat.value}>
                      <button
                        type="button"
                        className={`w-full flex items-center px-3 py-2 gap-2 hover:bg-blue-100 ${form.category === cat.label ? "bg-blue-50" : ""}`}
                        onClick={() => handleCategorySelect(cat)}
                      >
                        <cat.icon className="h-5 w-5" />
                        {cat.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold flex items-center justify-center hover:bg-blue-700 transition" disabled={loading}>
            {loading ? <span className="loader" /> : mode === "create" ? "Add Product" : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
}