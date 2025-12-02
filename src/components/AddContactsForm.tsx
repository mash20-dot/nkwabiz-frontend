import { useState } from "react";
import Button from "@/components/Button";
import { useContacts } from "@/context/ContactsContext";

interface AddContactFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AddContactForm: React.FC<AddContactFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const { addNewContact, getAllCategories } = useContacts();
  const [newContact, setNewContact] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = getAllCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContact.trim() || !newCategory.trim()) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await addNewContact(newContact, newCategory);
      setNewContact("");
      setNewCategory("");
      alert("Contact added successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to add contact:", err);
      alert("Failed to add contact. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewContact("");
    setNewCategory("");
    onClose();
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6">
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
  );
};

export default AddContactForm;
