import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { MessageCircle, Send, CircleX, CreditCard } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";

type BadgeStatusColor = "success" | "error" | "gray" | "warning";

type messagesProp = {
  id: number;
  title: string;
  recipients: string;
  status: string;
  statusColor: BadgeStatusColor;
  date: string;
};

const messages: messagesProp[] = [
  {
    id: 1,
    title: "Promo Alert",
    recipients:
      "+23481239788, +2349034356798, +22480673454, +22480673454, +22480673454, +22480673454",
    status: "Delivered",
    statusColor: "success",
    date: "Nov 6, 2025",
  },
  {
    id: 2,
    title: "Reminder",
    recipients: "+23481239788, +2349034356798, +22480673454",
    status: "Pending",
    statusColor: "warning",
    date: "Nov 5, 2025",
  },
  {
    id: 3,
    title: "Welcome Message",
    recipients: "+23481239788, +2349034356798, +22480673454",
    status: "Failed",
    statusColor: "error",
    date: "Nov 4, 2025",
  },
  {
    id: 4,
    title: "Upcoming Features",
    recipients: "+23481239788, +2349034356798, +22480673454",
    status: "Delivered",
    statusColor: "success",
    date: "Nov 2, 2025",
  },
  {
    id: 5,
    title: "Introducing Our Platform",
    recipients: "+23481239788, +2349034356798, +22480673454",
    status: "Delivered",
    statusColor: "success",
    date: "Nov 2, 2025",
  },
];

const SmsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start justify-center gap-6">
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
        {/* Total Messages Card */}
        <SummaryCard
          title="Total Messages"
          icon={MessageCircle}
          iconColor="text-blue-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">...</div>
        </SummaryCard>

        {/* SMS Delivered */}
        <SummaryCard
          title="SMS Delivered"
          icon={Send}
          iconColor="text-green-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">2,000</div>
        </SummaryCard>

        {/* Failed Messages */}
        <SummaryCard
          title="Failed Messages"
          icon={CircleX}
          iconColor="text-red-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">130</div>
        </SummaryCard>

        {/* Failed Messages */}
        <SummaryCard
          title="Remaining Balance"
          icon={CreditCard}
          iconColor="text-blue-500"
        >
          <div className="text-[1.5rem] font-semibold text-gray-900">2500</div>
        </SummaryCard>
      </div>

      {/* Recent Messages Table */}
      <TableCard.Root
        className="w-full bg-white border border-gray-200"
        size="sm"
      >
        <TableCard.Header
          className="font-medium text-lg bg-white text-gray-800"
          title="Recent Messages"
        />

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

          <Table.Body className="w-full" items={messages}>
            {(message) => (
              <Table.Row
                key={message.id}
                className="cursor-pointer bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <Table.Cell>{message.id}</Table.Cell>
                <Table.Cell>
                  <span className="font-normal text-gray-800">
                    {message.title}
                  </span>
                </Table.Cell>
                <Table.Cell className="truncate">
                  {message.recipients}
                </Table.Cell>
                <Table.Cell>
                  <Badge color={message.statusColor} size="sm">
                    {message.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{message.date}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
};

export default SmsDashboard;
