import { apiFetch } from "./api";

// Deduct stock (make a sale)
export async function makeSale(product_name: string, quantity: number) {
  return apiFetch("/stock_manage/stocks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_name, quantity }),
  }, true);
}

// Get stock alerts (premium feature)
export async function getStockAlerts() {
  return apiFetch("/stock_manage/stock/alert", {
    method: "GET",
  }, true);
}