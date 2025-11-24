import React, { useEffect, useState } from "react";
import { ShoppingCart, Download, Plus } from "lucide-react";
import { getSalesHistory } from "../../utils/salesApi";
import SaleModal from "../../components/SaleModal";

type SaleHistoryItem = {
  sale_id?: string;
  id?: string;
  product_name: string;
  date: string;
  customer?: string;
  items?: number;
  quantity?: number;
  total?: string;
  total_price?: number;
  status?: string;
};

type Product = {
  product_name: string;
  remaining_stock: number;
};

const Sales: React.FC = () => {
  const [sales, setSales] = useState<SaleHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  // Always provide products for SaleModal!
  const [products] = useState<Product[]>([
    // You can fetch from API, here are dummy products for error-free usage:
    { product_name: "Rice", remaining_stock: 20 },
    { product_name: "Sugar", remaining_stock: 15 },
  ]);

  useEffect(() => {
    setLoading(true);
    getSalesHistory()
      .then((data: SaleHistoryItem[]) => setSales(data))
      .finally(() => setLoading(false));
  }, []);

  const filteredSales = sales; // Add filtering logic if needed

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </button>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            onClick={() => setModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Record New Sale
          </button>
        </div>
      </div>
      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        products={products}
      />
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Sale ID</th>
                <th className="px-6 py-3">Date & Time</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7}>Loading...</td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4">{sale.sale_id || sale.id}</td>
                    <td className="px-6 py-4">{sale.date}</td>
                    <td className="px-6 py-4">{sale.customer || "N/A"}</td>
                    <td className="px-6 py-4">
                      {sale.items || sale.quantity || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {sale.total || sale.total_price || "N/A"}
                    </td>
                    <td className="px-6 py-4">{sale.status || "Completed"}</td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Sales;
