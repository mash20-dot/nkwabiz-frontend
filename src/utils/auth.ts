import { isTokenExpired } from "./tokenUtils";

export function isAuthenticated(): boolean {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return false;
  }

  // Check if token is expired
  if (isTokenExpired(token)) {
    // Token expired, clear it
    logout();
    return false;
  }

  return true;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("business_name");
}

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}