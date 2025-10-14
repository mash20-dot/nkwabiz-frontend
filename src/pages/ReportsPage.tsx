import React, { useEffect, useState } from "react";
import { getSalesHistory, getProductsSold } from "../utils/salesApi";

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

export default function ReportsPage() {
  const [salesHistory, setSalesHistory] = useState<SaleHistoryItem[]>([]);
  const [basicSold, setBasicSold] = useState<ProductSoldItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [premiumError, setPremiumError] = useState<string>("");

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

  const totalSales = salesHistory.reduce((sum, s) => sum + (s.total_price || 0), 0);
  const totalProfit = salesHistory.reduce((sum, s) => sum + (s.profit || 0), 0);

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Analytics & Reports</h1>
      {premiumError && <div className="text-red-500 mb-2">{premiumError}</div>}
      <div className="bg-white shadow rounded-lg mb-6 p-6">
        {salesHistory.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold text-gray-700">Total Sales</h2>
              <div className="text-xl">₵{totalSales.toFixed(2)}</div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-700">Total Profit</h2>
              <div className="text-xl">₵{totalProfit.toFixed(2)}</div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-semibold text-gray-700">Products Sold</h2>
            <ul>
              {basicSold.map((item, idx) => (
                <li key={idx}>
                  <span className="font-semibold">{item.product_name}</span> —
                  Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
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
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-4">
                  Loading...
                </td>
              </tr>
            )}
            {salesHistory.length > 0
              ? salesHistory.map((sale, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">{sale.product_name}</td>
                    <td className="px-6 py-4">{sale.quantity}</td>
                    <td className="px-6 py-4">
                      ₵{sale.unit_price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      ₵{sale.total_price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">₵{sale.profit?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {new Date(sale.date).toLocaleString()}
                    </td>
                  </tr>
                ))
              : basicSold.length > 0
              ? basicSold.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">{item.product_name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-400 italic" colSpan={4}>
                      Premium analytics required
                    </td>
                  </tr>
                ))
              : !loading && (
                  <tr>
                    <td className="px-6 py-4" colSpan={6}>
                      No sales history found.
                    </td>
                  </tr>
                )}
          </tbody>
        </table>
      </div>
    </div>
  );
}