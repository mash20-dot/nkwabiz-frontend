import { apiFetch } from "./api";

export interface PaymentHistory {
  amount: number;
  created_at: string;
  bundle_type: string;
  status: string;
}

/**
 * Fetches all payment history for the authenticated user
 */
export async function getPaymentHistory(): Promise<PaymentHistory[]> {
  try {
    const response = await apiFetch(
      "/payment/history",
      { method: "GET" },
      true
    );

    if (Array.isArray(response)) {
      return response as PaymentHistory[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
}