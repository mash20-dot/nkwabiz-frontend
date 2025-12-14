import { Users, UserPlus, Trash2, Upload } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useContacts } from "@/context/ContactsContext";
import Button from "@/components/Button";
import { Table, TableCard } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Badge } from "@/components/base/badges/badges";
import AddContactForm from "@/components/AddContactsForm";
import DeleteContactDialog from "@/components/ConfirmationModal";
import ImportContactsModal from "@/components/ImportContactsModal";

import { toast } from "sonner";

const ContactsPage = () => {
  const {
    contacts,
    loading,
    error,
    hasMore,
    totalContacts,
    loadMore,
    getAllCategories,
    deleteContact
  } = useContacts();

  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [prefilledCategory, setPrefilledCategory] = useState<
    string | undefined
  >(undefined);

  // Delete dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<{
    id: number;
    phone: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Infinite scroll observer
  const observer = useRef<IntersectionObserver>();
  const lastContactRef = useCallback(
    (node: HTMLDivElement | HTMLTableRowElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          console.log("Last contact visible - loading more...");
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  const categories = getAllCategories();

  const filteredContacts =
    selectedCategory === "all"
      ? contacts
      : contacts.filter((c) => c.category === selectedCategory);

  const handleCloseModal = () => {
    setShowAddContactModal(false);
    setPrefilledCategory(undefined);
  };

  const handleOpenModal = () => {
    setShowAddContactModal(true);
  };

  const handleOpenImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleImportSuccess = (message: string) => {
    setTimeout(() => {
      setShowImportModal(false);
      toast.success(message || "Contacts imported successfully");
    }, 500);
  };

  const handleImportError = (message: string) => {
    toast.error(message || "Failed to import contacts");
  };

  const handleDeleteClick = (contactId: number, phoneNumber: string) => {
    setContactToDelete({ id: contactId, phone: phoneNumber });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!contactToDelete) return;

    try {
      setIsDeleting(true);
      await deleteContact(contactToDelete.id);

      toast.success(`Contact ${contactToDelete.phone} deleted successfully`);
      setShowDeleteDialog(false);
      setContactToDelete(null);
    } catch (err: any) {
      console.error("Failed to delete contact:", err);
      toast.error(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete contact. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setContactToDelete(null);
  };

  if (loading && contacts.length === 0) {
    return <p className="text-gray-600">Loading contacts...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <>
      {/* Add Contact Modal */}
      {showAddContactModal && (
        <AddContactForm
          onClose={handleCloseModal}
          onSuccess={(message) => {
            handleCloseModal();

            setTimeout(() => {
              toast.success(message || "Contact added successfully");
            }, 100);
          }}
          onError={(message) => {
            toast.error(message || "Failed to add contact");
          }}
          preSelectedCategory={prefilledCategory}
        />
      )}

      {/* Import Contacts Modal */}
      {showImportModal && (
        <ImportContactsModal
          onClose={handleCloseImportModal}
          onSuccess={handleImportSuccess}
          onError={handleImportError}
        />
      )}

      {/* Delete Contact Confirmation Dialog */}
      <DeleteContactDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        contactNumber={contactToDelete?.phone || ""}
        isDeleting={isDeleting}
      />

      <div className="flex flex-col w-full items-start gap-6">
        {/* Page Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-medium text-gray-900">Contacts</h1>
            <p className="text-sm text-gray-600 font-normal">
              Total: {totalContacts} contacts
              {categories.length > 0 && ` in ${categories.length} categories`}
              {loading && contacts.length === 0 && " (Loading...)"}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              className="cursor-pointer bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
              onClick={handleOpenImportModal}
            >
              <Upload
                className="h-4 w-4 mr-2 text-gray-700"
                aria-hidden="true"
              />
              Import
            </Button>
            <Button
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
              onClick={handleOpenModal}
            >
              <UserPlus
                className="h-4 w-4 mr-2 text-white"
                aria-hidden="true"
              />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="w-full">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedCategory === "all"
                  ? "bg-blue-100 text-blue-600 border border-blue-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
              >
                All ({totalContacts})
              </button>
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${selectedCategory === category
                      ? "bg-blue-100 text-blue-600 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                  >
                    {category} (
                    {contacts.filter((c) => c.category === category).length})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State and Table */}
        {filteredContacts.length === 0 && !loading ? (
          <div className="w-full border border-gray-200 rounded-md flex items-center justify-center overflow-hidden px-8 py-20">
            <EmptyState size="sm">
              <EmptyState.Header pattern="none">
                <EmptyState.FeaturedIcon color="brand" theme="light" />
              </EmptyState.Header>

              <EmptyState.Content>
                <EmptyState.Title className="text-gray-800">
                  No contacts yet
                </EmptyState.Title>
                <EmptyState.Description className="text-gray-600">
                  You haven't saved any contacts yet. Get started by adding a
                  new contact or importing from a file.
                </EmptyState.Description>
              </EmptyState.Content>

              <EmptyState.Footer>
                <div className="flex gap-3">
                  <Button
                    className="cursor-pointer bg-white hover:bg-gray-50 border-gray-300 text-gray-700"
                    onClick={handleOpenImportModal}
                  >
                    <Upload className="h-4 w-4 mr-2 text-gray-700" />
                    Import Contacts
                  </Button>
                  <Button
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                    onClick={handleOpenModal}
                  >
                    <Users className="h-4 w-4 mr-2 text-white" />
                    Add Contact
                  </Button>
                </div>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Hidden on Mobile */}
            <TableCard.Root
              className="hidden md:block w-full bg-white border border-gray-200"
              size="sm"
            >
              <Table className="react-aria-table w-full">
                <Table.Header className="w-full border-b border-gray-200">
                  <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>Phone Number</Table.Head>
                    <Table.Head>Category</Table.Head>
                    <Table.Head>Actions</Table.Head>
                  </Table.Row>
                </Table.Header>

                <Table.Body className="w-full">
                  {filteredContacts.map((contact, index) => {
                    const isLastItem = filteredContacts.length === index + 1;

                    return (
                      <Table.Row
                        key={contact.id}
                        ref={isLastItem ? lastContactRef : null}
                        className="cursor-pointer bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                      >
                        <Table.Cell>{index + 1}</Table.Cell>
                        <Table.Cell>
                          <span className="font-normal text-gray-800">
                            {contact.contact}
                          </span>
                        </Table.Cell>

                        <Table.Cell>
                          <Badge color="gray" size="sm">
                            {contact.category}
                          </Badge>
                        </Table.Cell>

                        <Table.Cell>
                          <Button
                            className="border-none hover:text-red-500"
                            onClick={() =>
                              handleDeleteClick(
                                contact.id,
                                contact.contact
                              )
                            }
                          >
                            <Trash2 />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </TableCard.Root>

            {/* Mobile Card View - Hidden on Desktop */}
            <div className="md:hidden w-full space-y-4">
              {filteredContacts.map((contact, index) => {
                const isLastItem = filteredContacts.length === index + 1;

                return (
                  <div
                    key={contact.id}
                    ref={isLastItem ? lastContactRef : null}
                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                  >
                    {/* ID and Category Row */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        ID: {index + 1}
                      </span>
                      <Badge color="gray" size="sm">
                        {contact.category}
                      </Badge>
                    </div>

                    {/* Phone Number */}
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-1">
                          Phone Number
                        </span>
                        <p className="text-sm text-gray-800 font-medium">
                          {contact.contact}
                        </p>
                      </div>

                      <Button
                        className="border-none hover:text-red-500"
                        onClick={() =>
                          handleDeleteClick(contact.id, contact.contact)
                        }
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loading Indicator - shows while loading more */}
            {loading && contacts.length > 0 && (
              <div className="w-full text-center py-4">
                <div className="inline-flex items-center gap-2 text-gray-600">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span>Loading more contacts...</span>
                </div>
              </div>
            )}

            {/* End Message - shows when all contacts loaded */}
            {!hasMore && contacts.length > 0 && (
              <div className="w-full text-center py-4 text-gray-500">
                All contacts loaded ({contacts.length} of {totalContacts})
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ContactsPage;