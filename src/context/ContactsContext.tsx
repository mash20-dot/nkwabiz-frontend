import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAllContacts,
  addContact as addContactAPI,
  Contact,
} from "@/utils/BulkSMS/smsService";

interface ContactsContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addNewContact: (contact: string, category: string) => Promise<void>;
  getContactsByCategory: (category: string) => Contact[];
  getAllCategories: () => string[];
}

const ContactsContext = createContext<ContactsContextType | undefined>(
  undefined,
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

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContacts();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const refetch = async () => {
    await fetchContacts();
  };

  const addNewContact = async (contact: string, category: string) => {
    try {
      await addContactAPI(contact, category);
      await refetch();
    } catch (err) {
      setError("Failed to add contact");
      console.error("Error adding contact:", err);
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
        refetch,
        addNewContact,
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
