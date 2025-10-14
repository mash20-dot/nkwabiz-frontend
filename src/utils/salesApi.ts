import { apiFetch } from "./api";

export type SaleHistoryItem = {
  sale_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  profit: number;
  date: string;
};

export type ProductSoldItem = {
  product_name: string;
  quantity: number;
};

// Premium: Get full sales history with analytics (requires premium)
export async function getSalesHistory() {
  return apiFetch("/stock_manage/stocks/history", { method: "GET" }, true);
}

// Free: Get basic products sold info
export async function getProductsSold() {
  return apiFetch("/stock_manage/product/sold", { method: "GET" }, true);
}