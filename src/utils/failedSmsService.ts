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
        const response = await apiFetch(
            `/sms/api/sms/failed-deliveries`,
            { method: "GET" },
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