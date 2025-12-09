import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import Button from "@/components/Button";
import { useContacts } from "@/context/ContactsContext";

interface AddContactFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  preSelectedCategory?: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

const AddContactForm: React.FC<AddContactFormProps> = ({
  onClose,
  onSuccess,
  preSelectedCategory,
}) => {
  const { addNewContact, getAllCategories } = useContacts();
  const [newContact, setNewContact] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const categories = getAllCategories();

  // Set category when preSelectedCategory changes
  useEffect(() => {
    if (preSelectedCategory) {
      setNewCategory(preSelectedCategory);
    }
  }, [preSelectedCategory]);

  // Auto-hide toast after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContact.trim() || !newCategory.trim()) {
      showToast("error", "Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await addNewContact(newContact, newCategory);

      // Extract and display backend success message
      const successMessage = response?.message || response?.data?.message || "Contact added successfully!";
      showToast("success", successMessage);

      setNewContact("");
      setNewCategory("");

      // Wait 2 seconds to show the toast, then close
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error("Failed to add contact:", err);

      // Extract and display backend error message
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to add contact. Please try again.";
      showToast("error", errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewContact("");
    setNewCategory("");
    onClose();
  };

  return (
    <div className="w-full fixed inset-0 z-50 flex items-center justify-center">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
              }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md mx-4 bg-white border border-gray-200 rounded-lg p-6 shadow-xl">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Add New Contact
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="0541234567"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter Ghana phone number (e.g., 0241234567)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Clients, Family, Friends"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
              required
            />
            {categories.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500 block mb-2">
                  Existing categories (click to use):
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className="text-xs px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded-full transition-colors"
                      disabled={isSubmitting}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Contact"}
            </Button>
            <Button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactForm;