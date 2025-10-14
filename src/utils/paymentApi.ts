import { apiFetch, getToken } from "./api";

/**
 * Initializes a premium subscription payment through Paystack.
 * Returns the authorization URL and reference for verification.
 * @param email - User's email address
 * @param amount - Amount to charge (for reference, actual charge is fixed at 9900 pesewas)
 */
export async function initializePayment(email: string, amount = 9900) {
  return apiFetch("/pay/initialize-payment", {
    method: "POST",
    body: JSON.stringify({ amount, email }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`,
    },
  }, true);
}

/**
 * Verifies the status of a payment transaction using the payment reference.
 * @param reference - Payment reference string (e.g., PAY-20251011143000-1)
 */
export async function verifyPayment(reference: string) {
  return apiFetch(`/pay/verify_payment/${reference}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  }, true);
}