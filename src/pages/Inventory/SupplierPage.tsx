import React, { useEffect, useState } from "react";
import { getProductsByStatus } from "../../utils/productApi";

type Product = {
  product_name: string;
  supplier_info: string;
  remaining_stock: number;
  initial_stock: number;
};

export default function SupplierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");

  useEffect(() => {
    getProductsByStatus("all").then((data: { products: Product[] }) => {
      setProducts(data.products || []);
      const supplierList: string[] = Array.from(
        new Set(
          (data.products || [])
            .map((p) =>
              typeof p.supplier_info === "string" ? p.supplier_info : ""
            )
            .filter((s) => s)
        )
      );
      setSuppliers(supplierList);
      setSelectedSupplier(supplierList[0] || "");
    });
  }, []);

  const productsForSupplier = products.filter(
    (p) => p.supplier_info === selectedSupplier
  );

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <div className="mb-4">
        <label className="font-medium mr-2">Choose supplier:</label>
        <select
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Remaining Stock</th>
              <th className="px-6 py-3">Low Stock</th>
            </tr>
          </thead>
          <tbody>
            {productsForSupplier.map((p, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{p.product_name}</td>
                <td className="px-6 py-4">{p.remaining_stock}</td>
                <td className="px-6 py-4">
                  {p.remaining_stock <=
                  Math.max(5, Math.floor(p.initial_stock * 0.1)) ? (
                    <span className="text-yellow-700 font-semibold">Low</span>
                  ) : (
                    <span className="text-green-700">OK</span>
                  )}
                </td>
              </tr>
            ))}
            {productsForSupplier.length === 0 && (
              <tr>
                <td className="px-6 py-4" colSpan={3}>
                  No products for this supplier.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
