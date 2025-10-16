import React, { useState } from "react";
import { makeSale } from "../utils/stockApi";
import { toast } from "react-hot-toast";

export default function SaleModal({
  open,
  onClose,
  products,
  onSaleRecorded,
}: {
  open: boolean;
  onClose: () => void;
  products: { product_name: string; remaining_stock: number }[];
  onSaleRecorded?: (message?: string) => void;
}) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSale(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await makeSale(productName, quantity);
      toast.success(result.message || "Sale successful!");
      if (onSaleRecorded) onSaleRecorded(result.message || "Sale successful!");
      onClose();
    } catch (err: any) {
      setError(err.error || err.message || "Could not complete sale");
      toast.error(err.error || err.message || "Could not complete sale");
      if (onSaleRecorded)
        onSaleRecorded(err.error || err.message || "Could not complete sale");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-blue-700">Record Sale</h2>
        <form className="grid gap-4" onSubmit={handleSale}>
          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <select
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="" disabled>
                Select product
              </option>
              {products.map((p) => (
                <option key={p.product_name} value={p.product_name}>
                  {p.product_name} (Stock: {p.remaining_stock})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold mt-2"
          >
            {loading ? "Processing..." : "Make Sale"}
          </button>
        </form>
      </div>
    </div>
  );
}