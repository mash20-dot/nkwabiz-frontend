import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getSalesHistory } from "../utils/salesApi";
import { getDashboardOverview } from "../utils/productApi";
import SaleModal from "../components/SaleModal";
import { formatCurrency } from "../utils/currencyUtils";

type SaleHistoryItem = {
  sale_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  profit: number;
  date?: string;
  time?: string;
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

        // Sort by sale_id descending (newest first)
        const sortedSales = salesArray.sort((a: SaleHistoryItem, b: SaleHistoryItem) => b.sale_id - a.sale_id);
        setSales(sortedSales);
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
    // Find the product to get unit price
    const product = products.find(p => p.product_name === saleData.product_name);
    const unitPrice = product?.selling_price || (saleData.total_price / saleData.quantity);
    const profit = product ? (unitPrice * saleData.quantity) - ((product.selling_price || 0) * saleData.quantity) : 0;

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = now.toLocaleTimeString();

    // Add new sale to the top of sales list with proper type
    const newSale: SaleHistoryItem = {
      sale_id: Date.now(), // Temporary ID
      product_name: saleData.product_name,
      quantity: saleData.quantity,
      unit_price: unitPrice,
      total_price: saleData.total_price,
      profit: profit,
      date: dateStr,
      time: timeStr,
    };
    setSales(prev => [newSale, ...prev]);
  };

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
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
      <div className="w-full bg-white shadow rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sale ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
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
                  <tr key={sale.sale_id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{sale.sale_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{sale.date || 'N/A'}</span>
                        <span className="text-xs text-gray-500">{sale.time || ''}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {sale.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(sale.unit_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(sale.total_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {formatCurrency(sale.profit)}
                      </span>
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