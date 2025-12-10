import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import SendSms from "./SendSms";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { useSms } from "@/context/BulkSmsContext";

const BulkSMS = () => {
  const { smsData, loading, error } = useSms();
  const [showForm, setShowForm] = useState<boolean>(false);

  const messages = smsData?.history || [];

  const location = useLocation();

  function handleCloseForm() {
    setShowForm(false);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("openForm") === "true") {
      setShowForm(true);
    }
  }, [location.search]);

  if (loading) {
    return <p className="text-gray-600">Loading SMS history...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <>
      {/* Bulk SMS Page */}
      <div
        className={
          showForm ? "hidden" : "flex flex-col items-start gap-6 w-full"
        }
      >
        {/* Page Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-medium text-gray-900">Bulk SMS</h1>
          <div className="flex gap-4">
            <Button
              className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
              onClick={() => setShowForm((prev) => !prev)}
            >
              <MessageCircle
                className="h-4 w-4 mr-2 text-white"
                aria-hidden="true"
              />
              Send Bulk SMS
            </Button>
          </div>
        </div>

        {/* Empty State or Table */}
        {messages.length === 0 ? (
          <div className="w-full border border-gray-200 rounded-md flex items-center justify-center overflow-hidden px-8 py-20">
            <EmptyState size="sm">
              <EmptyState.Header pattern="none">
                <EmptyState.FeaturedIcon color="brand" theme="light" />
              </EmptyState.Header>

              <EmptyState.Content>
                <EmptyState.Title className="text-gray-800">
                  No SMS messages yet
                </EmptyState.Title>
                <EmptyState.Description className="text-gray-600">
                  You haven't sent any bulk SMS messages yet. Get started by
                  sending your first message to your recipients.
                </EmptyState.Description>
              </EmptyState.Content>

              <EmptyState.Footer>
                <Button
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                  onClick={() => setShowForm((prev) => !prev)}
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-white" />
                  Send Bulk SMS
                </Button>
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
                    <Table.Head>Message</Table.Head>
                    <Table.Head>Recipients</Table.Head>
                    <Table.Head>Status</Table.Head>
                    <Table.Head>Date</Table.Head>
                  </Table.Row>
                </Table.Header>

                <Table.Body className="w-full">
                  {messages.map((message) => (
                    <Table.Row
                      key={message.id}
                      className="cursor-pointer bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                    >
                      <Table.Cell>{message.id}</Table.Cell>
                      <Table.Cell>
                        <span className="font-normal text-gray-800">
                          {message.message}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="truncate">
                        {message.recipient}
                      </Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={
                            message.status === "delivered"
                              ? "success"
                              : message.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="sm"
                        >
                          {message.status}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell className="truncate">
                        {message.created_at}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </TableCard.Root>

            {/* Mobile Card View - Hidden on Desktop */}
            <div className="md:hidden w-full space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                >
                  {/* ID and Status Row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">
                      ID: {message.id}
                    </span>
                    <Badge
                      color={
                        message.status === "delivered"
                          ? "success"
                          : message.status === "pending"
                          ? "warning"
                          : "error"
                      }
                      size="sm"
                    >
                      {message.status}
                    </Badge>
                  </div>

                  {/* Message */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Message
                    </span>
                    <p className="text-sm text-gray-800">{message.message}</p>
                  </div>

                  {/* Recipients */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Recipients
                    </span>
                    <p className="text-sm text-gray-800">{message.recipient}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <span className="text-xs font-medium text-gray-500 block mb-1">
                      Date
                    </span>
                    <p className="text-sm text-gray-800">
                      {message.created_at}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Send Bulk SMS */}
      <SendSms showForm={showForm} closeForm={handleCloseForm} />
    </>
  );
};

export default BulkSMS;
