import { apiFetch } from "../api";

export interface SmsHistory {
  id: number;
  status: string;
  recipients: string;
  message: string;
}

export async function getSmsHistory(): Promise<SmsHistory[]> {
  return apiFetch("/sms/all/sms", { method: "GET" }, true);
}
