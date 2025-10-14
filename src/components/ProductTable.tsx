import React from "react";
import { Edit, Archive } from "lucide-react";
import { Product } from "../utils/productApi";
import { CATEGORY_LIST } from "../utils/categories";

function getCategoryIcon(label: string) {
  const cat = CATEGORY_LIST.find(c => c.label === label);
  return cat ? cat.icon : CATEGORY_LIST[CATEGORY_LIST.length - 1].icon;
}

export default function ProductTable({
  products,
  onEdit,
  onArchive,
  archiveLoading
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onArchive: (productId: number) => void;
  archiveLoading: number | null;
}) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map(product => {
          const CatIcon = getCategoryIcon(product.category || "Other");
          return (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                <CatIcon className="h-5 w-5" />
                {product.product_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{product.price ?? `₵${product.selling_price?.toFixed(2)}`}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock ?? product.initial_stock}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={
                  product.status === "Low Stock" ? "text-yellow-600 font-semibold" :
                  product.status === "Out of Stock" ? "text-red-600 font-semibold" :
                  product.status === "Archived" ? "text-gray-400 font-semibold" :
                  "text-green-600 font-semibold"
                }>
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                <button className="text-blue-600 hover:text-blue-800" onClick={() => onEdit(product)}><Edit className="h-4 w-4" /></button>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => onArchive(product.id)} disabled={archiveLoading === product.id}>
                  {archiveLoading === product.id ? "Archiving..." : <Archive className="h-4 w-4" />}
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}