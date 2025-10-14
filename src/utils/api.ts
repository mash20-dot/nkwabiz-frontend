import { API_BASE_URL } from "./config";

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}