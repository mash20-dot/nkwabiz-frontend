// ============================================
// FIXED VERSION OF @/utils/api.ts
// This version is iOS Safari compatible
// ============================================

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
    "Accept": "application/json",
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

  // Create abort controller for timeout (iOS Safari needs this)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: 'include', // CRITICAL: This fixes iOS Safari cookie/auth issues
      signal: controller.signal, // Add timeout support
    });

    clearTimeout(timeoutId);

    // If token expired, your backend should respond with 401
    if (res.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      throw { message: "Session expired. Please log in again." };
    }

    let data;
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!res.ok) throw data;
    return data;

  } catch (error: any) {
    clearTimeout(timeoutId);

    // Handle timeout errors for iOS Safari
    if (error.name === 'AbortError') {
      throw {
        message: "Request timed out. Please check your connection and try again.",
        timeout: true
      };
    }

    // Handle network errors for iOS Safari
    if (error instanceof TypeError &&
      (error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.message?.includes('Network request failed'))) {
      throw {
        message: "Network error. Please check your internet connection.",
        network: true
      };
    }

    throw error;
  }
}