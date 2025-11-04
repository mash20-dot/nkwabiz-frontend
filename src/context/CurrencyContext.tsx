import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api"; //

export type CurrencyCode = "NGN" | "USD" | "CLP";
export type Currency = { code: CurrencyCode; label: string };
const DEFAULT: Currency = { code: "CLP", label: "Chilean Peso" };

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => Promise<void>;
  loading: boolean;
};

const CurrencyContext = createContext<Ctx>({
  currency: DEFAULT,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrency: async () => {},
  loading: true,
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        // Adjust endpoint to match your backend (example: /user/preferences or /me/preferences)
        const data = await apiFetch("/user/preferences", {}, true);
        if (!mounted) return;
        if (data?.currency) {
          setCurrencyState({
            code: data.currency,
            label: data.label ?? data.currency,
          });
        }
      } catch (err) {
        // no preference or fetch failed -> keep default
        console.warn("Could not load user currency preference:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const setCurrency = async (c: Currency) => {
    // optimistic update
    setCurrencyState(c);
    try {
      await apiFetch(
        "/user/preferences",
        {
          method: "PUT", // or POST depending on your API
          body: JSON.stringify({ currency: c.code }),
        },
        true
      );
    } catch (err) {
      console.error("Failed to save currency preference:", err);
      // Optionally rollback or show toast
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, loading }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
