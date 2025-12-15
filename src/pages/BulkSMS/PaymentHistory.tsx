import { useState, useEffect } from "react";
import { getPaymentHistory, PaymentHistory } from "@/utils/paymentService";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Receipt, Loader2 } from "lucide-react";
import { format } from "date-fns";

const PaymentHistoryPage = () => {
    const [payments, setPayments] = useState<PaymentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPaymentHistory();
            setPayments(data);
        } catch (err) {
            setError("Failed to load payment history");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch {
            return dateString;
        }
    };

    const formatAmount = (amount: number) => {
        return `GH₵ ${amount.toFixed(2)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-6 w-full">
            {/* Page Header */}
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-medium text-gray-900">Payment History</h1>
            </div>

            {/* Payment History Table/Cards */}
            {payments.length === 0 ? (
                <div className="w-full border border-gray-200 rounded-md flex items-center justify-center overflow-hidden px-8 py-20">
                    <EmptyState size="sm">
                        <EmptyState.Header pattern="none">
                            <EmptyState.FeaturedIcon color="brand" theme="light">
                                <Receipt className="h-6 w-6" />
                            </EmptyState.FeaturedIcon>
                        </EmptyState.Header>

                        <EmptyState.Content>
                            <EmptyState.Title className="text-gray-800">
                                No payment history
                            </EmptyState.Title>
                            <EmptyState.Description className="text-gray-600">
                                You haven't made any SMS bundle purchases yet. Purchase a bundle to get started.
                            </EmptyState.Description>
                        </EmptyState.Content>
                    </EmptyState>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <TableCard.Root
                        className="hidden md:block w-full bg-white border border-gray-200"
                        size="sm"
                    >
                        <TableCard.Header
                            className="font-medium text-lg bg-white text-gray-800"
                            title={`Payment History (${payments.length})`}
                        />

                        <Table className="react-aria-table w-full">
                            <Table.Header className="w-full border-y border-gray-200">
                                <Table.Row>
                                    <Table.Head>Date</Table.Head>
                                    <Table.Head>Bundle Type</Table.Head>
                                    <Table.Head>Amount</Table.Head>
                                    <Table.Head>Status</Table.Head>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body className="w-full">
                                {payments.map((payment, index) => (
                                    <Table.Row
                                        key={index}
                                        className="bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                                    >
                                        <Table.Cell>{formatDate(payment.created_at)}</Table.Cell>
                                        <Table.Cell>
                                            <span className="font-medium text-gray-800 capitalize">
                                                {payment.bundle_type}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="font-semibold text-gray-900">
                                            {formatAmount(payment.amount)}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                color={
                                                    payment.status === "success"
                                                        ? "success"
                                                        : payment.status === "pending"
                                                            ? "warning"
                                                            : "error"
                                                }
                                                size="sm"
                                            >
                                                {payment.status}
                                            </Badge>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </TableCard.Root>

                    {/* Mobile Card View */}
                    <div className="md:hidden w-full">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">
                            Payment History ({payments.length})
                        </h2>
                        <div className="space-y-4">
                            {payments.map((payment, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                                >
                                    {/* Date and Status Row */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(payment.created_at)}
                                        </span>
                                        <Badge
                                            color={
                                                payment.status === "success"
                                                    ? "success"
                                                    : payment.status === "pending"
                                                        ? "warning"
                                                        : "error"
                                            }
                                            size="sm"
                                        >
                                            {payment.status}
                                        </Badge>
                                    </div>

                                    {/* Bundle Type */}
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Bundle Type
                                        </span>
                                        <p className="text-sm font-medium text-gray-800 capitalize">
                                            {payment.bundle_type}
                                        </p>
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Amount
                                        </span>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatAmount(payment.amount)}
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

export default PaymentHistoryPage;