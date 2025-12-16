import { apiFetch } from "@/utils/api";

export interface FailedSMS {
    recipient: string;
    message: string;
    timestamp: string;
}

export interface FailedSMSResponse {
    failed_count: number;
    failed_messages: FailedSMS[];
}

/**
 * Fetch failed SMS messages for the current user
 */
export const getFailedSMS = async (): Promise<FailedSMSResponse> => {
    try {
        // No need to fetch user info first - backend uses JWT token
        // Directly fetch failed deliveries
        const response = await apiFetch(
            `/sms/api/sms/failed-deliveries`,  // ← Removed /${userId} from path
            {},
            true
        );
        return response;
    } catch (error: any) {
        console.error("Error fetching failed SMS:", error);
        throw new Error(
            error.response?.data?.error ||
            error.message ||
            "Failed to fetch failed SMS messages"
        );
    }
};