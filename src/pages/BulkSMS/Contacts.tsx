import { Users } from "lucide-react";
import Button from "@/components/Button";
import { Table, TableCard } from "@/components/application/table/table";

type contactsProps = {
  id: number;
  name: string;
  email: string;
  contact: number;
};

const contacts: contactsProps[] = [
  {
    id: 1,
    name: "Lando Norris",
    email: "ln4@mclaren.com",
    contact: +44756789323,
  },
  {
    id: 2,
    name: "Max Verstappen",
    email: "mv1@redbull.com",
    contact: +1756789323,
  },
  {
    id: 3,
    name: "Oscar Paistri",
    email: "op81@mclaren.com",
    contact: +24756789323,
  },
  {
    id: 4,
    name: "Lewis Hamilton",
    email: "lh44@ferrari.com",
    contact: +44756789323,
  },
];

const ContactsPage = () => {
  return (
    <div className="flex w-full h-full items-start justify-center">
      <div className="flex flex-col items-start justify-center gap-6">
        {/* Page Header */}
        <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <h1 className="text-2xl font-medium text-gray-900">Customers</h1>
          <div className="flex gap-4">
            <Button className="cursor-pointer bg-blue-600 hover:bg-blue-700 border-blue-600 text-white">
              <Users className="h-4 w-4 mr-2 text-white" aria-hidden="true" />
              Add Customers
            </Button>
          </div>
        </div>

        {/* Table */}
        <TableCard.Root
          className="w-full bg-white border border-gray-200"
          size="sm"
        >
          <Table className="react-aria-table w-full">
            <Table.Header className="w-full border-b border-gray-200">
              <Table.Row>
                <Table.Head>ID</Table.Head>
                <Table.Head>Name</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head>Contact</Table.Head>
              </Table.Row>
            </Table.Header>

            <Table.Body className="w-full" items={contacts}>
              {(contact) => (
                <Table.Row
                  key={contact.id}
                  className="cursor-pointer bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                >
                  <Table.Cell>{contact.id}</Table.Cell>
                  <Table.Cell>
                    <span className="font-normal text-gray-800">
                      {contact.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="truncate">{contact.email}</Table.Cell>

                  <Table.Cell>{contact.contact}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </TableCard.Root>
      </div>
    </div>
  );
};

export default ContactsPage;
