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
  getSmsHistoryFull,
  SmsHistory,
} from "@/utils/BulkSMS/smsService";

interface SmsContextType {
  messages: SmsHistory[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalMessages: number;
  stats: {
    total_sms: number;
    total_delivered: number;
    total_failed: number;
    total_pending: number;
  };
  smsData: {
    total_sms: number;
    total_delivered: number;
    total_failed: number;
    total_pending: number;
    history: SmsHistory[];
  } | null;
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
    total_sms: 0,
    total_delivered: 0,
    total_failed: 0,
    total_pending: 0,
  });
  const isFetchingRef = useRef(false);

  // Fetch overall stats (for dashboard) - called once on mount
  const fetchStats = async () => {
    try {
      const data = await getSmsHistoryFull();

      setStats({
        total_sms: data.total_sms,
        total_delivered: data.total_delivered,
        total_failed: data.total_failed,
        total_pending: data.total_pending,
      });
    } catch (err) {
      console.error("Error fetching SMS stats:", err);
    }
  };

  // Fetch paginated messages (for history list)
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
      setPage(pageNum);

      // Also update stats from the paginated response
      setStats({
        total_sms: data.total_sms,
        total_delivered: data.total_delivered,
        total_failed: data.total_failed,
        total_pending: data.total_pending,
      });
    } catch (err) {
      setError("Failed to load SMS history");
      console.error("Error fetching SMS history:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Initial load: fetch stats and first page
  useEffect(() => {
    const initialize = async () => {
      await fetchStats();
      await fetchMessages(1, false);
    };
    initialize();
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || isFetchingRef.current) return;

    console.log(`Loading SMS page ${page + 1}...`);
    await fetchMessages(page + 1, true);
  }, [hasMore, loading, page]);

  const refetch = useCallback(async () => {
    setPage(1);
    setMessages([]);
    await fetchStats(); // Refresh stats
    await fetchMessages(1, false);
  }, []);

  // Create smsData object for backward compatibility with dashboard
  const smsData = {
    total_sms: stats.total_sms,
    total_delivered: stats.total_delivered,
    total_failed: stats.total_failed,
    total_pending: stats.total_pending,
    history: messages,
  };

  return (
    <SmsContext.Provider
      value={{
        messages,
        loading,
        error,
        hasMore,
        totalMessages,
        stats,
        smsData,
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