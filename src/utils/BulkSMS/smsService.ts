import { apiFetch } from "../api";

export interface SmsHistory {
  id: number;
  status: string;
  recipient: string;
  message: string;
  message_id: string;
  created_at: string;
}

export interface SmsStats {
  total_sms: number;
  total_delivered: number;
  total_failed: number;
  total_pending: number;
}

export interface SmsHistoryResponse {
  total_sms: number;
  total_delivered: number;
  total_failed: number;
  total_pending: number;
  history: SmsHistory[];
}

// Get full SMS response (stats + history)
export async function getSmsHistoryFull(): Promise<SmsHistoryResponse> {
  try {
    const response = await apiFetch("/sms/all/sms", { method: "GET" }, true);

    if (response && typeof response === "object" && "history" in response) {
      return response as SmsHistoryResponse;
    }

    throw new Error("Unexpected API response structure");
  } catch (error) {
    console.error("Error fetching SMS history:", error);
    throw error;
  }
}

// Get only SMS history array
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

    return [];
  } catch (error) {
    console.error("Error fetching SMS history:", error);
    throw error;
  }
}

// Get only SMS statistics
export async function getSmsStats(): Promise<SmsStats> {
  try {
    const response = await getSmsHistoryFull();
    return {
      total_sms: response.total_sms,
      total_delivered: response.total_delivered,
      total_failed: response.total_failed,
      total_pending: response.total_pending,
    };
  } catch (error) {
    console.error("Error fetching SMS stats:", error);
    throw error;
  }
}
