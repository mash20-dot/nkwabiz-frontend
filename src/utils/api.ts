import { API_BASE_URL } from "./config";
import { useAuthStore } from "../store/useAuthStore";
import { isTokenExpired } from "./tokenUtils";

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
    ...(options.headers as Record<string, string>),
  };
  if (auth) {
    const token = getToken();
    if (!token) throw { message: "Not authenticated" };
    if (isTokenExpired(token)) {
      // Token expired, auto-logout
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      throw { message: "Session expired. Please log in again." };
    }
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // If token expired, your backend should respond with 401
  if (res.status === 401) {
    useAuthStore.getState().clearAuth();
    window.location.href = "/login";
    throw { message: "Session expired. Please log in again." };
  }
  const data = await res.json();

  if (!res.ok) throw data;
  return data;
}
