import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { MessageCircle, Send, CircleX } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { useSms } from "@/context/SmsContext";

const SmsDashboard = () => {
  const navigate = useNavigate();
  const { smsData, loading, error } = useSms();

  const stats = {
    total_sms: smsData?.total_sms ?? 0,
    total_delivered: smsData?.total_delivered ?? 0,
    total_pending: smsData?.total_pending ?? 0,
    total_failed: smsData?.total_failed ?? 0,
  };

  const messages = smsData?.history || [];

  const recentMessages = messages.slice(0, 5);

  const statsCards = [
    {
      title: "Total SMS",
      icon: MessageCircle,
      iconColor: "text-blue-500",
      value: stats.total_sms,
    },
    {
      title: "Total Sent",
      icon: Send,
      iconColor: "text-green-500",
      value: stats.total_delivered,
    },
    {
      title: "Total Pending",
      icon: CircleX,
      iconColor: "text-orange-500",
      value: stats.total_pending,
    },
    {
      title: "Total Failed",
      icon: CircleX,
      iconColor: "text-red-500",
      value: stats.total_failed,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">SMS Management</h1>
        <div className="flex gap-4">
          <Button
            className="bg-blue-600 hover:bg-blue-700 border-blue-600 cursor-pointer text-white"
            onClick={() => navigate("/sms/bulksms?openForm=true")}
          >
            <MessageCircle
              className="h-4 w-4 mr-2 text-white"
              aria-hidden="true"
            />
            Send Bulk SMS
          </Button>
        </div>
      </div>

      {/* SMS Overview */}
      <div className="w-full grid grid-cols-2 gap-3 md:gap-4 lg:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <SummaryCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            iconColor={card.iconColor}
          >
            <div className="text-[1.5rem] font-semibold text-gray-900">
              {loading ? "..." : card.value}
            </div>
          </SummaryCard>
        ))}
      </div>

      {/* Recent Messages Table */}
      {recentMessages.length === 0 ? (
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
                onClick={() => navigate("/sms/bulksms?openForm=true")}
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
            <TableCard.Header
              className="font-medium text-lg bg-white text-gray-800"
              title="Recent Messages"
            />

            <Table className="react-aria-table w-full">
              <Table.Header className="w-full border-y border-gray-200">
                <Table.Row>
                  <Table.Head>ID</Table.Head>
                  <Table.Head>Message</Table.Head>
                  <Table.Head>Recipients</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Date</Table.Head>
                </Table.Row>
              </Table.Header>

              <Table.Body className="w-full">
                {recentMessages.map((message) => (
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
                    <Table.Cell>{message.created_at}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </TableCard.Root>

          {/* Mobile Card View - Hidden on Desktop */}
          <div className="md:hidden w-full">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              Recent Messages
            </h2>
            <div className="space-y-4">
              {recentMessages.map((message) => (
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
          </div>
        </>
      )}
    </div>
  );
};

export default SmsDashboard;
