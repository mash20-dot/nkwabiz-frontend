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
  sender_id: string[];
  history: SmsHistory[];
}

export interface SendSmsRequest {
  recipients?: string[];
  category?: string;  // NEW: Send to entire category
  message: string;
  sender: string;
}

export interface SendSmsResponse {
  message: string;
  queued: number;
  failed?: number;
  errors?: string[];
  category?: string;
}

export interface Contact {
  user_id: number;
  id: number;
  contact: string;
  category: string;
}

// NEW: Category info interface
export interface CategoryInfo {
  category: string;
  count: number;
}

export interface CategoriesResponse {
  total_contacts: number;
  categories: CategoryInfo[];
}

export interface AddContactRequest {
  contact: string;
  category: string;
}

export interface AddContactResponse {
  message: string;
}

export interface SmsBundle {
  id: number;
  name: string;
  sms_credits: number;
  price: number;
  price_per_sms: number;
}

export interface PaystackInitializeResponse {
  bundle?: SmsBundle;
  paystack_data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentVerificationResponse {
  message: string;
  paystack_status: string;
  payment_status: string;
  amount: number;
  current_sms_balance: number;
}

export interface DeleteContactResponse {
  message: string;
}

// NEW: Paginated response interface
export interface PaginatedContactsResponse {
  contacts: Contact[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
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

// NEW: Get categories with counts (INSTANT - for display)
export async function getContactCategories(): Promise<CategoriesResponse> {
  try {
    const response = await apiFetch(
      "/sms/contact/categories",
      { method: "GET" },
      true
    );

    return response as CategoriesResponse;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

// UPDATED: Send SMS with category support
export async function sendSms(
  recipients: string[] | string,
  message: string,
  sender: string,
  category?: string  // NEW: optional category parameter
): Promise<SendSmsResponse> {
  try {
    const payload: SendSmsRequest = {
      message,
      sender,
    };

    // If category is provided, send to that category
    if (category) {
      payload.category = category;
    } else {
      // Otherwise, use recipients list
      payload.recipients = Array.isArray(recipients) ? recipients : [recipients];
    }

    const response = await apiFetch(
      "/sms/api/sms/send",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      true
    );

    return response as SendSmsResponse;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
}

// Get contacts with pagination (for viewing in ContactsPage)
export async function getAllContacts(
  page: number = 1,
  perPage: number = 50,
  category?: string
): Promise<PaginatedContactsResponse> {
  try {
    let url = `/sms/all/contact?page=${page}&per_page=${perPage}`;

    if (category && category !== 'all') {
      url += `&category=${encodeURIComponent(category)}`;
    }

    const response = await apiFetch(url, { method: "GET" }, true);

    if (response && typeof response === "object") {
      if ("contacts" in response && "pagination" in response) {
        return response as PaginatedContactsResponse;
      }

      if (Array.isArray(response)) {
        return {
          contacts: response as Contact[],
          pagination: {
            page: 1,
            per_page: response.length,
            total: response.length,
            total_pages: 1,
            has_next: false,
            has_prev: false,
          },
        };
      }

      if ("message" in response) {
        return {
          contacts: [],
          pagination: {
            page: 1,
            per_page: perPage,
            total: 0,
            total_pages: 0,
            has_next: false,
            has_prev: false,
          },
        };
      }
    }

    return {
      contacts: [],
      pagination: {
        page: 1,
        per_page: perPage,
        total: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
}

// Add a new contact
export async function addContact(
  contact: string,
  category: string
): Promise<AddContactResponse> {
  try {
    const response = await apiFetch(
      "/sms/contacts",
      {
        method: "POST",
        body: JSON.stringify({ contact, category }),
      },
      true
    );

    return response as AddContactResponse;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
}

// Delete Contact
export async function deleteContact(
  contactId: number
): Promise<DeleteContactResponse> {
  try {
    const response = await apiFetch(
      `/sms/delete/${contactId}`,
      {
        method: "DELETE",
      },
      true
    );

    return response as DeleteContactResponse;
  } catch (error) {
    console.error("Error deleting contact:", error);
    throw error;
  }
}

// Get all available SMS bundles
export async function getSMSBundles(): Promise<SmsBundle[]> {
  try {
    const response = await apiFetch(
      "/payment/get-bundles",
      { method: "GET" },
      false
    );

    if (response && Array.isArray(response.bundles)) {
      return response.bundles;
    }

    return [];
  } catch (error) {
    console.error("Error fetching SMS bundles:", error);
    throw error;
  }
}

// Initialize payment for a bundle
export async function initializeSMSPayment(
  bundleType: "small" | "medium" | "large" | "xl"
): Promise<PaystackInitializeResponse> {
  try {
    console.log("Calling initialize payment with:", bundleType);

    const response = await apiFetch(
      "/payment/initialize-payment",
      {
        method: "POST",
        body: JSON.stringify({ bundle_type: bundleType }),
      },
      true
    );

    console.log("Raw backend response:", response);

    if (response.paystack_data?.data) {
      return {
        bundle: response.bundle,
        paystack_data: response.paystack_data.data,
      };
    }

    return response as PaystackInitializeResponse;
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw error;
  }
}

// Verify payment after user returns from Paystack
export async function verifyPayment(
  reference: string
): Promise<PaymentVerificationResponse> {
  try {
    const response = await apiFetch(
      `/payment/verify_payment/${reference}`,
      { method: "GET" },
      true
    );

    return response as PaymentVerificationResponse;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}