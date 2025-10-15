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

export type SalesHistoryResponse = {
  summary?: {
    recent_date: string;
    total_profit_for_recent_date: number;
    total_sales_for_recent_date: number;
  };
  history?: SaleHistoryItem[];
};

// Premium: Get full sales history with analytics (requires premium)
export async function getSalesHistory(): Promise<SaleHistoryItem[]> {
  return apiFetch("/stock_manage/stocks/history", { method: "GET" }, true);
}

export async function getSalesHistoryWithSummary() {
  return apiFetch("/stock_manage/stocks/history", { method: "GET" }, true);
}

// Free: Get basic products sold info
export async function getProductsSold() {
  return apiFetch("/stock_manage/product/sold", { method: "GET" }, true);
}