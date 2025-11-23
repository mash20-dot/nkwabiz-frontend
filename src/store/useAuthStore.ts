import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  businessName: string | null;
  currency: string | null;
  setAuth: (token: string, businessName: string, currency?: string) => void;
  setCurrency: (currency: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  businessName: localStorage.getItem("business_name"),
  currency: localStorage.getItem("currency") || "GHS",

  setAuth: (token, businessName, currency = "GHS") => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("business_name", businessName);
    localStorage.setItem("currency", currency);
    set({ accessToken: token, businessName, currency });
  },

  setCurrency: (currency) => {
    localStorage.setItem("currency", currency);
    set({ currency });
  },

  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("business_name");
    localStorage.removeItem("currency");
    set({ accessToken: null, businessName: null, currency: null });
  },
}));