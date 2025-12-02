import { Users, UserPlus, X } from "lucide-react";
import { useState } from "react";
import { useContacts } from "@/context/ContactsContext";
import Button from "@/components/Button";
import { Table, TableCard } from "@/components/application/table/table";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Badge } from "@/components/base/badges/badges";
import AddContactForm from "@/components/AddContactsForm";

const ContactsPage = () => {
  const { contacts, loading, error, getAllCategories } = useContacts();
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = getAllCategories();

  const filteredContacts =
    selectedCategory === "all"
      ? contacts
      : contacts.filter((c) => c.category === selectedCategory);

  if (loading) {
    return <p className="text-gray-600">Loading contacts...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="flex-1 h-full w-full items-start justify-center">
      <div className="w-full flex-1 h-full flex flex-col items-start justify-start gap-6">
        {/* Page Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-medium text-gray-900">Contacts</h1>
            <p className="text-sm text-gray-600 font-normal">
              Total: {contacts.length} contacts
              {categories.length > 0 && ` in ${categories.length} categories`}
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              className={
                showAddContactModal
                  ? ""
                  : "cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
              }
              onClick={() => setShowAddContactModal(!showAddContactModal)}
            >
              {showAddContactModal ? (
                <>
                  <X
                    className="h-4 w-4 mr-2 text-gray-600"
                    aria-hidden="true"
                  />
                  Cancel
                </>
              ) : (
                <>
                  <UserPlus
                    className="h-4 w-4 mr-2 text-white"
                    aria-hidden="true"
                  />
                  Add Contact
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Add Contact Modal */}
        {showAddContactModal && (
          <AddContactForm
            onClose={() => setShowAddContactModal(false)}
            onSuccess={() => {
              console.log("Contact added successfully!");
            }}
          />
        )}

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="w-full">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
              >
                All ({contacts.length})
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    selectedCategory === category
                      ? "bg-blue-100 text-blue-600 border border-blue-300"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {category} (
                  {contacts.filter((c) => c.category === category).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State and Table */}
        {filteredContacts.length === 0 ? (
          <div className="w-full h-full flex-1 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden px-8 pt-10 pb-12">
            <EmptyState size="sm">
              <EmptyState.Header pattern="none">
                <EmptyState.FeaturedIcon color="brand" theme="light" />
              </EmptyState.Header>

              <EmptyState.Content>
                <EmptyState.Title className="text-gray-800">
                  No SMS messages yet
                </EmptyState.Title>
                <EmptyState.Description className="text-gray-600">
                  You haven't saved any contacts yet. Get started by adding a
                  new contact.
                </EmptyState.Description>
              </EmptyState.Content>

              <EmptyState.Footer>
                <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white">
                  <Users className="h-4 w-4 mr-2 text-white" />
                  Add Contact{" "}
                </Button>
              </EmptyState.Footer>
            </EmptyState>
          </div>
        ) : (
          <TableCard.Root
            className="w-full bg-white border border-gray-200"
            size="sm"
          >
            <Table className="react-aria-table w-full">
              <Table.Header className="w-full border-b border-gray-200">
                <Table.Row>
                  <Table.Head>ID</Table.Head>
                  <Table.Head>Phone Number</Table.Head>
                  <Table.Head>Category</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body className="w-full">
                {contacts.map((contact, index) => (
                  <Table.Row
                    key={index}
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
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableCard.Root>
        )}
      </div>
    </div>
  );
};

export default ContactsPage;
