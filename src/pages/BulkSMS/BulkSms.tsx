import Button from "@/components/Button";
import { MessageCircle } from "lucide-react";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";

type BadgeStatusColor = "success" | "error" | "gray" | "warning";

type messagesProp = {
  id: number;
  title: string;
  recipients: number;
  status: string;
  statusColor: BadgeStatusColor;
  cost: string;
  date: string;
};

const messages: messagesProp[] = [
  {
    id: 1,
    title: "Promo Alert",
    recipients: 120,
    status: "Delivered",
    statusColor: "success",
    cost: "GHS 18.00",
    date: "Nov 6, 2025",
  },
  {
    id: 2,
    title: "Reminder",
    recipients: 80,
    status: "Pending",
    statusColor: "warning",
    cost: "GHS 12.00",
    date: "Nov 5, 2025",
  },
  {
    id: 3,
    title: "Welcome Message",
    recipients: 40,
    status: "Failed",
    statusColor: "error",
    cost: "GHS 6.00",
    date: "Nov 4, 2025",
  },
  {
    id: 4,
    title: "Upcoming Features",
    recipients: 40,
    status: "Delivered",
    statusColor: "success",
    cost: "GHS 6.00",
    date: "Nov 2, 2025",
  },
  {
    id: 5,
    title: "Introducing Our Platform",
    recipients: 40,
    status: "Delivered",
    statusColor: "success",
    cost: "GHS 6.00",
    date: "Nov 2, 2025",
  },
];

const BulkSMS = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Bulk SMS</h1>
        <div className="flex gap-4">
          <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white">
            <MessageCircle
              className="h-4 w-4 mr-2 text-white"
              aria-hidden="true"
            />
            Send Bulk SMS
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableCard.Root
        className="w-full bg-white border border-gray-200"
        size="sm"
      >
        <Table>
          <Table.Header className="border-y border-gray-200">
            <Table.Row>
              <Table.Head>Message</Table.Head>
              <Table.Head>Recipients</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Cost</Table.Head>
              <Table.Head>Date</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body items={messages}>
            {(message) => (
              <Table.Row
                key={message.id}
                className="cursor-pointer bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
              >
                <Table.Cell>
                  <span className="font-medium text-primary">
                    {message.title}
                  </span>
                </Table.Cell>
                <Table.Cell>{message.recipients}</Table.Cell>
                <Table.Cell>
                  <Badge color={message.statusColor} size="sm">
                    {message.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{message.cost}</Table.Cell>
                <Table.Cell>{message.date}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
};

export default BulkSMS;
