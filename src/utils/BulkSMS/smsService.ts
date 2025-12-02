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

export interface Contact {
  user_id: number;
  contact: string;
  category: string;
}

export interface AddContactRequest {
  contact: string;
  category: string;
}

export interface AddContactResponse {
  message: string;
}

export type ContactsResponse = Contact[] | { message: string; contacts: [] };

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

// Get all contacts
export async function getAllContacts(): Promise<Contact[]> {
  try {
    const response = await apiFetch(
      "/sms/all/contact",
      { method: "GET" },
      true,
    );

    if (
      response &&
      typeof response === "object" &&
      "message" in response &&
      "contacts" in response
    ) {
      return [];
    }

    if (Array.isArray(response)) {
      return response as Contact[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

// Add a new contact
export async function addContact(
  contact: string,
  category: string,
): Promise<AddContactResponse> {
  try {
    const response = await apiFetch(
      "/sms/contacts",
      {
        method: "POST",
        body: JSON.stringify({ contact, category }),
      },
      true,
    );

    return response as AddContactResponse;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}
