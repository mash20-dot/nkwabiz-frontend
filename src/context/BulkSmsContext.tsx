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
  SmsMessage,
} from "@/utils/BulkSMS/smsService";

interface SmsContextType {
  messages: SmsMessage[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalMessages: number;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

const SmsContext = createContext<SmsContextType | undefined>(undefined);

interface SmsProviderProps {
  children: ReactNode;
}

export const SmsProvider: React.FC<SmsProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<SmsMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalMessages, setTotalMessages] = useState(0);
  const [page, setPage] = useState(1);
  const isFetchingRef = useRef(false);

  const fetchMessages = async (pageNum: number, append: boolean = false) => {
    // Prevent duplicate requests
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Assuming getSmsHistory accepts page and per_page parameters
      const data = await getSmsHistory(pageNum, 50);

      if (append) {
        // Append new messages to existing ones (for infinite scroll)
        setMessages(prev => [...prev, ...data.history]);
      } else {
        // Replace messages (for initial load or refetch)
        setMessages(data.history);
      }

      setHasMore(data.pagination.has_next);
      setTotalMessages(data.pagination.total);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load SMS history");
      console.error("Error fetching SMS history:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Load first page on mount
  useEffect(() => {
    fetchMessages(1, false);
  }, []);

  // Load more messages (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || isFetchingRef.current) return;

    console.log(`Loading SMS page ${page + 1}...`);
    await fetchMessages(page + 1, true);
  }, [hasMore, loading, page]);

  // Refetch from beginning (after sending new SMS)
  const refetch = async () => {
    setPage(1);
    setMessages([]); // Clear existing messages
    await fetchMessages(1, false);
  };

  return (
    <SmsContext.Provider
      value={{
        messages,
        loading,
        error,
        hasMore,
        totalMessages,
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