import React, { useEffect, useState } from "react";
import SaleModal from "../components/SaleModal";
import { getDashboardOverview } from "../utils/productApi";
import {
  getSalesHistory,
  getProductsSold,
  SaleHistoryItem,
} from "../utils/salesApi";
import { Toaster, toast } from "react-hot-toast";
import Button from "../components/Button";
import { Plus } from "lucide-react";

type Product = {
  product_name: string;
  remaining_stock: number;
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
    getDashboardOverview().then((data: Product[]) => setProducts(data));
  }, []);

  const fetchSalesHistory = () => {
    setLoading(true);
    getSalesHistory()
      .then((data: { sales_history: SaleHistoryItem[]; summary?: any }) => {
        const parsed = (data.sales_history || []).map((sale) => ({
          ...sale,
          sale_id: sale.sale_id ? String(sale.sale_id) : undefined,
        }));
        setSalesHistory(parsed);
        setBasicSold([]);
        setPremiumError("");
      })
      .catch((err: { message?: string }) => {
        if (
          err.message?.includes("premium") ||
          err.message?.includes("expired")
        ) {
          setPremiumError(err.message || "");
          getProductsSold()
            .then((data: ProductSoldItem[]) => setBasicSold(data))
            .catch(() => setBasicSold([]));
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSalesHistory();
  }, []);

  function handleSaleRecorded(message?: string) {
    fetchSalesHistory();
    if (message) toast.success(message);
  }

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <Toaster position="top-right" />
      <SaleModal
        open={saleModalOpen}
        onClose={() => setSaleModalOpen(false)}
        products={products}
        onSaleRecorded={handleSaleRecorded}
      />
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Sales History</h1>
        <div className="flex gap-[1rem]">
          <Button
            className="bg-blue-600 border-blue-600 text-white"
            onClick={() => setSaleModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
            Record New Sale
          </Button>
        </div>
      </div>

      {premiumError && <div className="text-red-500 mb-2">{premiumError}</div>}
      <div className="w-full bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Sale ID</th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Quantity</th>
                <th className="px-6 py-3">Unit Price</th>
                <th className="px-6 py-3">Total Price</th>
                <th className="px-6 py-3">Profit</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td className="px-6 py-4" colSpan={7}>
                    Loading...
                  </td>
                </tr>
              )}
              {salesHistory.length > 0
                ? salesHistory.map((sale, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{sale.sale_id}</td>
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
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4">{item.product_name}</td>
                      <td className="px-6 py-4">{item.quantity}</td>
                      <td
                        className="px-6 py-4 text-gray-400 italic"
                        colSpan={4}
                      >
                        Premium analytics required
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td className="px-6 py-4" colSpan={7}>
                        No sales history found.
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
