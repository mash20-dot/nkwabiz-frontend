import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getSalesHistory } from "../utils/salesApi";
import { getDashboardOverview } from "../utils/productApi";
import SaleModal from "../components/SaleModal";
import { formatCurrency } from "../utils/currencyUtils";

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
  selling_price: number;
  initial_stock: number;
  expiration_date: string;
  remaining_stock: number;
};

const Sales: React.FC = () => {
  const [sales, setSales] = useState<SaleHistoryItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productsLoading, setProductsLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    getSalesHistory()
      .then((data) => {
        console.log("💰 Sales history response:", data);
        // Handle different response formats
        const salesArray = Array.isArray(data)
          ? data
          : Array.isArray(data.sales_history)
            ? data.sales_history
            : [];
        console.log("💰 Sales array:", salesArray);
        setSales(salesArray);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch sales:", err);
        setSales([]);
      })
      .finally(() => setLoading(false));

    // Fetch products for the sale modal
    setProductsLoading(true);
    getDashboardOverview()
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : (Array.isArray(data.products) ? data.products : []);
        setProducts(productsArray);
      })
      .catch(() => setProducts([]))
      .finally(() => setProductsLoading(false));
  }, []);

  const filteredSales = sales; // Add filtering logic if needed

  // Handle new sale - add to list immediately
  const handleSaleComplete = (saleData: {
    product_name: string;
    quantity: number;
    total_price: number;
    date: string;
  }) => {
    // Add new sale to the top of sales list with proper type
    const newSale: SaleHistoryItem = {
      sale_id: `temp_${Date.now()}`,
      product_name: saleData.product_name,
      quantity: saleData.quantity,
      total_price: saleData.total_price,
      date: new Date(saleData.date).toLocaleString(),
      status: "Completed",
    };
    setSales(prev => [newSale, ...prev]);
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Record New Sale
        </button>
      </div>
      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        products={products}
        onSaleComplete={handleSaleComplete}
      />
      <div className="bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">No sales found</td>
                </tr>
              ) : (
                filteredSales.map((sale, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.sale_id || sale.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.customer || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.items || sale.quantity || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {typeof sale.total_price === "number"
                        ? formatCurrency(sale.total_price)
                        : sale.total || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {sale.status || "Completed"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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