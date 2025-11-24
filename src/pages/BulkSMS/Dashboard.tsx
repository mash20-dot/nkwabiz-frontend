import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { MessageCircle, Send, CircleX, CreditCard } from "lucide-react";
import SummaryCard from "@/components/SummaryCard";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";

const SmsDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">SMS Management</h1>
        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white">
            <MessageCircle
              className="h-4 w-4 mr-2 text-white"
              aria-hidden="true"
            />
            Send Bulk SMS
          </Button>
        </div>
      </div>

      {/* SMS Overview */}
      <div className="w-full grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
      <TableCard.Root className="w-full" size="sm">
        <TableCard.Header
          className="font-medium text-gray-800"
          title="Recent Messages"
        />

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>Message</Table.Head>
              <Table.Head>Recipients</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head>Cost</Table.Head>
              <Table.Head>Date</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <span className="font-medium text-primary">Promo Alert</span>
              </Table.Cell>
              <Table.Cell>120</Table.Cell>
              <Table.Cell>
                <Badge color="success" size="sm">
                  Delivered
                </Badge>
              </Table.Cell>
              <Table.Cell>GHS 18.00</Table.Cell>
              <Table.Cell>Nov 6, 2025</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <span className="font-medium text-primary">Reminder</span>
              </Table.Cell>
              <Table.Cell>80</Table.Cell>
              <Table.Cell>
                <Badge color="gray" size="sm">
                  Pending
                </Badge>
              </Table.Cell>
              <Table.Cell>GHS 12.00</Table.Cell>
              <Table.Cell>Nov 5, 2025</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <span className="font-medium text-primary">
                  Welcome Message
                </span>
              </Table.Cell>
              <Table.Cell>40</Table.Cell>
              <Table.Cell>
                <Badge color="error" size="sm">
                  Failed
                </Badge>
              </Table.Cell>
              <Table.Cell>GHS 6.00</Table.Cell>
              <Table.Cell>Nov 4, 2025</Table.Cell>
            </Table.Row>

            <Table.Row>
              <Table.Cell>
                <span className="font-medium text-primary">
                  Welcome Message
                </span>
              </Table.Cell>
              <Table.Cell>40</Table.Cell>
              <Table.Cell>
                <Badge color="error" size="sm">
                  Failed
                </Badge>
              </Table.Cell>
              <Table.Cell>GHS 6.00</Table.Cell>
              <Table.Cell>Nov 4, 2025</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </TableCard.Root>
    </div>
  );
};

export default SmsDashboard;
