import { apiFetch } from "./api";

export interface Product {
  id: number;
  product_name: string;
  selling_price: number;
  amount_spent?: number;
  initial_stock: number;
  expiration_date: string;
  supplier_info?: string;
  status?: string;
  category?: string;
  price?: string;
  stock?: number;
  archived_at?: string;
  remaining_stock?: number;
}

// Endpoints
export async function createProduct(
  product: Omit<Product, "id" | "status" | "category" | "price" | "stock">
) {
  return apiFetch(
    "/product_view/product/post_product",
    {
      method: "POST",
      body: JSON.stringify(product),
    },
    true
  );
}

export async function updateProduct(
  productId: number,
  updates: Partial<Product>
) {
  return apiFetch(
    `/product_view/product/${productId}`,
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
    true
  );
}

export async function archiveProduct(productId: number) {
  return apiFetch(
    `/product_view/product/${productId}/archive`,
    {
      method: "POST",
    },
    true
  );
}

export async function searchProductsByName(name: string) {
  return apiFetch(
    `/product_view/product/filter?name=${encodeURIComponent(name)}`,
    {},
    true
  );
}

export async function getProductsByStatus(
  status: "active" | "archived" | "all" = "active"
) {
  return apiFetch(`/product_view/product?status=${status}`, {}, true);
}

export async function getDashboardOverview() {
  return apiFetch("/dashboard/board", {}, true);
}
