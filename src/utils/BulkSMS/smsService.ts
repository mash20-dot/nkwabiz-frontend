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

export interface SendSmsRequest {
  recipients: string[];
  message: string;
}

export interface SendSmsResponse {
  message: string;
  queued: number;
  failed?: number;
  errors?: string[];
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

// Send SMS to multiple recipients
export async function sendSms(
  recipients: string[],
  message: string,
): Promise<SendSmsResponse> {
  try {
    const response = await apiFetch(
      "/sms/send",
      {
        method: "POST",
        body: JSON.stringify({
          recipients,
          message,
        }),
      },
      true,
    );

    return response as SendSmsResponse;
  } catch (error) {
    console.error("Error sending SMS:", error);
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

// Get all available SMS bundles
export async function getSMSBundles(): Promise<SmsBundle[]> {
  try {
    const response = await apiFetch(
      "/payment/get-bundles",
      { method: "GET" },
      false,
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
  bundleType: "small" | "medium" | "large" | "xl",
): Promise<PaystackInitializeResponse> {
  try {
    console.log("Calling initialize payment with:", bundleType);

    const response = await apiFetch(
      "/payment/initialize-payment",
      {
        method: "POST",
        body: JSON.stringify({ bundle_type: bundleType }),
      },
      true,
    );

    console.log("Raw backend response:", response);

    // Extract the nested data
    if (response.paystack_data?.data) {
      return {
        bundle: response.bundle,
        paystack_data: response.paystack_data.data, // Extract the nested data object
      };
    }

    // If structure is different, return as is
    return response as PaystackInitializeResponse;
  } catch (error) {
    console.error("Error initializing payment:", error);
    throw error;
  }
}

// Verify payment after user returns from Paystack
export async function verifyPayment(
  reference: string,
): Promise<PaymentVerificationResponse> {
  try {
    const response = await apiFetch(
      `payment/verify_payment/${reference}`,
      { method: "GET" },
      true,
    );

    return response as PaymentVerificationResponse;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
}
