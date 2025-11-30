import { apiFetch } from "../api";

export interface SmsHistory {
  id: number;
  status: string;
  recipient: string;
  message: string;
  message_id: string;
  created_at: string;
}

export interface SmsHistoryResponse {
  total_sms: number;
  total_delivered: number;
  total_failed: number;
  total_pending: number;
  history: SmsHistory[];
}

export async function getSmsHistory(): Promise<SmsHistory[]> {
  try {
    const response = await apiFetch("/sms/all/sms", { method: "GET" }, true);

    // Check if response has the expected structure
    if (response && typeof response === "object" && "history" in response) {
      return (response as SmsHistoryResponse).history;
    }

    // If response is already an array, return it
    if (Array.isArray(response)) {
      return response;
    }

    console.error("Unexpected API response structure:", response);
    return [];
  } catch (error) {
    console.error("Error fetching SMS history:", error);
    throw error;
  }
}
