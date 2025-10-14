import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  businessName: string | null;
  setAuth: (token: string, businessName: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("access_token"),
  businessName: localStorage.getItem("business_name"),
  setAuth: (token, businessName) => {
    localStorage.setItem("access_token", token);
    localStorage.setItem("business_name", businessName);
    set({ accessToken: token, businessName });
  },
  clearAuth: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("business_name");
    set({ accessToken: null, businessName: null });
  },
}));