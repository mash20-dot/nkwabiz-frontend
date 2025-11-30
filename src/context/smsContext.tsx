import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getSmsHistoryFull,
  SmsHistoryResponse,
} from "@/utils/BulkSMS/smsService";

interface SmsContextType {
  smsData: SmsHistoryResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const SmsContext = createContext<SmsContextType | undefined>(undefined);

interface SmsProviderProps {
  children: ReactNode;
}

export const SmsProvider: React.FC<SmsProviderProps> = ({ children }) => {
  const [smsData, setSmsData] = useState<SmsHistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSmsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getSmsHistoryFull();
      setSmsData(data);
    } catch (err) {
      setError("Failed to load SMS data");
      console.error("Error fetching SMS data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSmsData();
  }, []);

  const refetch = async () => {
    await fetchSmsData();
  };

  return (
    <SmsContext.Provider value={{ smsData, loading, error, refetch }}>
      {children}
    </SmsContext.Provider>
  );
};

export const useSms = () => {
  const context = useContext(SmsContext);
  if (context === undefined) {
    throw new Error("useSms must be used within a SmsProvider");
  }
  return context;
};
