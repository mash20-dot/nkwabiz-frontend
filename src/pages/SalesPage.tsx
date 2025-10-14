import React, { useEffect, useState } from "react";
import SaleModal from "../components/SaleModal";
import { getDashboardOverview } from "../utils/productApi";
import { getSalesHistory, getProductsSold } from "../utils/salesApi";

type Product = {
  product_name: string;
  remaining_stock: number;
};

type SaleHistoryItem = {
  sale_id?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  profit: number;
  date: string;
};

type ProductSoldItem = {
  product_name: string;
  quantity: number;
};

export default function SalesPage() {
  const [saleModalOpen, setSaleModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleHistoryItem[]>([]);
  const [basicSold, setBasicSold] = useState<ProductSoldItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumError, setPremiumError] = useState<string>("");

  useEffect(() => {
    getDashboardOverview()
      .then((data: Product[]) => setProducts(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getSalesHistory()
      .then((data: SaleHistoryItem[]) => {
        setSalesHistory(data);
        setBasicSold([]);
        setPremiumError("");
      })
      .catch((err: { message?: string }) => {
        if (err.message?.includes("premium") || err.message?.includes("expired")) {
          setPremiumError(err.message || "");
          getProductsSold()
            .then((data: ProductSoldItem[]) => setBasicSold(data))
            .catch(() => setBasicSold([]));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <SaleModal open={saleModalOpen} onClose={() => setSaleModalOpen(false)} products={products} />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales History</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setSaleModalOpen(true)}
        >
          Record New Sale
        </button>
      </div>
      {premiumError && <div className="text-red-500 mb-2">{premiumError}</div>}
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                {salesHistory.length > 0 && (
                  <>
                    <th className="px-6 py-3">Unit Price</th>
                    <th className="px-6 py-3">Total Price</th>
                    <th className="px-6 py-3">Profit</th>
                    <th className="px-6 py-3">Date</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && <tr><td className="px-6 py-4" colSpan={6}>Loading...</td></tr>}
              {salesHistory.length > 0
                ? salesHistory.map((sale, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{sale.product_name}</td>
                      <td className="px-6 py-4">{sale.quantity}</td>
                      <td className="px-6 py-4">₵{sale.unit_price?.toFixed(2)}</td>
                      <td className="px-6 py-4">₵{sale.total_price?.toFixed(2)}</td>
                      <td className="px-6 py-4">₵{sale.profit?.toFixed(2)}</td>
                      <td className="px-6 py-4">{new Date(sale.date).toLocaleString()}</td>
                    </tr>
                  ))
                : basicSold.length > 0
                ? basicSold.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{item.product_name}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-400 italic" colSpan={4}>Premium analytics required</td>
                    </tr>
                  ))
                : !loading && (
                  <tr>
                    <td className="px-6 py-4" colSpan={6}>No sales history found.</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}