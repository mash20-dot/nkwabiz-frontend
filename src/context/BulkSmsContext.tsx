import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import {
  getSmsHistory,
  SmsHistory,
} from "@/utils/BulkSMS/smsService";

interface SmsContextType {
  messages: SmsHistory[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalMessages: number;
  stats: {
    total_delivered: number;
    total_failed: number;
    total_pending: number;
  };
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

const SmsContext = createContext<SmsContextType | undefined>(undefined);

interface SmsProviderProps {
  children: ReactNode;
}

export const SmsProvider: React.FC<SmsProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<SmsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({
    total_delivered: 0,
    total_failed: 0,
    total_pending: 0,
  });
  const isFetchingRef = useRef(false);

  const fetchMessages = async (pageNum: number, append: boolean = false) => {
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const data = await getSmsHistory(pageNum, 50);

      if (append) {
        setMessages(prev => [...prev, ...data.history]);
      } else {
        setMessages(data.history);
      }

      setHasMore(data.pagination.has_next);
      setTotalMessages(data.pagination.total);
      setStats({
        total_delivered: data.total_delivered,
        total_failed: data.total_failed,
        total_pending: data.total_pending,
      });
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load SMS history");
      console.error("Error fetching SMS history:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchMessages(1, false);
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || isFetchingRef.current) return;

    console.log(`Loading SMS page ${page + 1}...`);
    await fetchMessages(page + 1, true);
  }, [hasMore, loading, page]);

  const refetch = useCallback(async () => {
    setPage(1);
    setMessages([]);
    await fetchMessages(1, false);
  }, []);

  return (
    <SmsContext.Provider
      value={{
        messages,
        loading,
        error,
        hasMore,
        totalMessages,
        stats,
        loadMore,
        refetch,
      }}
    >
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