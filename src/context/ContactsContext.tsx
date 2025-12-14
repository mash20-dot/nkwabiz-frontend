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
  getAllContacts,
  addContact as addContactAPI,
  deleteContact as deleteContactAPI,
  Contact,
  AddContactResponse,
} from "@/utils/BulkSMS/smsService";

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  totalContacts: number;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  addNewContact: (
    contact: string,
    category: string
  ) => Promise<AddContactResponse>;
  deleteContact: (contactId: number) => Promise<void>;
  getContactsByCategory: (category: string) => Contact[];
  getAllCategories: () => string[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined
);

interface ContactsProviderProps {
  children: ReactNode;
}

export const ContactsProvider: React.FC<ContactsProviderProps> = ({
  children,
}) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);
  const [page, setPage] = useState(1);
  const isFetchingRef = useRef(false);

  const fetchContacts = async (pageNum: number, append: boolean = false) => {
    // Prevent duplicate requests
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const data = await getAllContacts(pageNum, 50);

      if (append) {
        // Append new contacts to existing ones (for infinite scroll)
        setContacts(prev => [...prev, ...data.contacts]);
      } else {
        // Replace contacts (for initial load or refetch)
        setContacts(data.contacts);
      }

      setHasMore(data.pagination.has_next);
      setTotalContacts(data.pagination.total);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  // Load first page on mount
  useEffect(() => {
    fetchContacts(1, false);
  }, []);

  // Load more contacts (for infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || isFetchingRef.current) return;

    console.log(`Loading page ${page + 1}...`);
    await fetchContacts(page + 1, true);
  }, [hasMore, loading, page]);

  // Refetch from beginning (after add/delete)
  const refetch = async () => {
    setPage(1);
    setContacts([]); // Clear existing contacts
    await fetchContacts(1, false);
  };

  // FIXED: Optimistically add contact to the top of the list
  const addNewContact = async (contact: string, category: string) => {
    try {
      const response = await addContactAPI(contact, category);

      // Add the new contact to the TOP of the list immediately
      setContacts(prev => [response, ...prev]);

      // Update total count
      setTotalContacts(prev => prev + 1);

      return response;
    } catch (err) {
      setError("Failed to add contact");
      throw err;
    }
  };

  // FIXED: Optimistically remove contact from the list
  const deleteContact = async (contactId: number): Promise<void> => {
    try {
      // Remove from UI immediately
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setTotalContacts(prev => prev - 1);

      // Then delete from API
      await deleteContactAPI(contactId);
    } catch (err) {
      setError("Failed to delete contact");
      console.error("Error deleting contact:", err);

      // Revert on error by refetching
      await refetch();
      throw err;
    }
  };

  const getContactsByCategory = (category: string): Contact[] => {
    return contacts.filter((contact) => contact.category === category);
  };

  const getAllCategories = () => {
    const categories = contacts.map((contact) => contact.category);
    return Array.from(new Set(categories));
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        error,
        hasMore,
        totalContacts,
        loadMore,
        refetch,
        addNewContact,
        deleteContact,
        getContactsByCategory,
        getAllCategories,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error("useContacts must be used within a ContactsProvider");
  }
  return context;
};