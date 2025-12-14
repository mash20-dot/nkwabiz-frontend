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
  getContactCategories,
  Contact,
  AddContactResponse,
  CategoryInfo,
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
  categoryCounts: Record<string, number>;
  categories: CategoryInfo[];
  refreshCategories: () => Promise<void>;
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

  // NEW: Store categories from API
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  const fetchContacts = async (pageNum: number, append: boolean = false) => {
    // Prevent duplicate requests
    if (isFetchingRef.current) return;

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      const data = await getAllContacts(pageNum, 50);

      // API now returns contacts sorted by newest first, no need to sort here
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

  // NEW: Fetch categories from API
  const fetchCategories = async () => {
    try {
      const data = await getContactCategories();
      setCategories(data.categories);
      
      // Convert to counts object
      const counts: Record<string, number> = {};
      data.categories.forEach(cat => {
        counts[cat.category] = cat.count;
      });
      setCategoryCounts(counts);
      
      console.log(`✅ Loaded ${data.categories.length} categories with ${data.total_contacts} total contacts`);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  // Load contacts and categories on mount
  useEffect(() => {
    fetchContacts(1, false);
    fetchCategories();
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
    await fetchCategories(); // Also refresh categories
  };

  // Refresh only categories
  const refreshCategories = async () => {
    await fetchCategories();
  };

  // FIXED: Add contact to the top of the list with proper ID
  const addNewContact = async (contact: string, category: string) => {
    try {
      const response = await addContactAPI(contact, category);
      
      console.log("API Response:", response); // Debug log
      
      // IMPORTANT: Create a properly formed contact object
      // Handle different possible API response structures
      const newContact: Contact = {
        id: response.id,
        contact: contact, // Use the input contact directly since API might not return it
        category: category, // Use the input category directly
      };
      
      console.log("New contact object:", newContact); // Debug log
      
      // Add the new contact to the TOP of the list immediately
      setContacts(prev => {
        const updated = [newContact, ...prev];
        console.log("Updated contacts array:", updated); // Debug log
        return updated;
      });
      
      // Update total count
      setTotalContacts(prev => prev + 1);
      
      // Optimistically update category counts
      setCategoryCounts(prev => ({
        ...prev,
        [category]: (prev[category] || 0) + 1
      }));
      
      // Check if it's a new category
      const categoryExists = categories.some(cat => cat.category === category);
      if (!categoryExists) {
        setCategories(prev => [...prev, { category, count: 1 }]);
      } else {
        // Update existing category count
        setCategories(prev => 
          prev.map(cat => 
            cat.category === category 
              ? { ...cat, count: cat.count + 1 }
              : cat
          )
        );
      }
      
      // Refresh from API to ensure accuracy
      await fetchCategories();
      
      return response;
    } catch (err) {
      setError("Failed to add contact");
      throw err;
    }
  };

  // FIXED: Optimistically remove contact from the list
  const deleteContact = async (contactId: number): Promise<void> => {
    try {
      // Find the contact to get its category
      const contactToDelete = contacts.find(c => c.id === contactId);
      
      // Remove from UI immediately
      setContacts(prev => prev.filter(c => c.id !== contactId));
      setTotalContacts(prev => prev - 1);
      
      // Optimistically update category counts
      if (contactToDelete) {
        const category = contactToDelete.category;
        setCategoryCounts(prev => ({
          ...prev,
          [category]: Math.max((prev[category] || 0) - 1, 0)
        }));
        
        // Update category list
        setCategories(prev => {
          const newCount = (categoryCounts[category] || 0) - 1;
          if (newCount <= 0) {
            // Remove category if count reaches 0
            return prev.filter(cat => cat.category !== category);
          } else {
            // Update count
            return prev.map(cat => 
              cat.category === category 
                ? { ...cat, count: newCount }
                : cat
            );
          }
        });
      }
      
      // Then delete from API
      await deleteContactAPI(contactId);
      
      // Refresh from API to ensure accuracy
      await fetchCategories();
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

  // Get all category names
  const getAllCategories = useCallback(() => {
    return categories.map(cat => cat.category);
  }, [categories]);

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
        categoryCounts,
        categories,
        refreshCategories,
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