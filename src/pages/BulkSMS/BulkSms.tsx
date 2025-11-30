import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import SendSms from "./SendSms";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSmsHistory } from "@/utils/BulkSMS/smsService";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import type { SmsHistory } from "@/utils/BulkSMS/smsService";

const BulkSMS = () => {
  const [smsData, setSmsData] = useState<SmsHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getSmsHistory();
        setSmsData(data);
      } catch (err) {
        setError("Failed to load SMS history");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

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
          showForm
            ? "hidden"
            : "flex h-full flex-1 flex-col items-start justify-center gap-6"
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
        {smsData.length === 0 ? (
          <div className="w-full flex-1 flex items-center justify-center overflow-hidden px-8 pt-10 pb-12">
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
          <TableCard.Root
            className="w-full bg-white border border-gray-200"
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
                {smsData.map((message) => (
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
        )}
      </div>

      {/* Send Bulk SMS */}
      <SendSms showForm={showForm} closeForm={handleCloseForm} />
    </>
  );
};

export default BulkSMS;
