// Update this file: src/pages/BulkSMS/FailedSms.tsx

import { useState, useEffect } from "react";
import { getFailedSMS, FailedSMS } from "@/utils/failedSmsService";
import { Table, TableCard } from "@/components/application/table/table";
import { Badge } from "@/components/base/badges/badges";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Button from "@/components/Button";

const FailedSmsPage = () => {
    const [failedMessages, setFailedMessages] = useState<FailedSMS[]>([]);
    const [failedCount, setFailedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFailedSMS();
    }, []);

    const fetchFailedSMS = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getFailedSMS();
            setFailedMessages(data.failed_messages);
            setFailedCount(data.failed_count);
        } catch (err: any) {
            setError(err.message || "Failed to load failed SMS messages");
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

    const handleRefresh = () => {
        fetchFailedSMS();
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
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium mb-4">{error}</p>
                    <Button onClick={handleRefresh} className="cursor-pointer">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-6 w-full">
            {/* Page Header */}
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Failed SMS Messages</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Review SMS messages that failed to deliver
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="cursor-pointer"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Statistics Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 w-full md:w-auto">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Total Failed Messages</p>
                        <p className="text-3xl font-semibold text-red-600">{failedCount}</p>
                        {failedCount === 100 && (
                            <p className="text-xs text-gray-500 mt-1">
                                Showing maximum of 100 most recent failed messages
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Failed SMS Table/Cards */}
            {failedMessages.length === 0 ? (
                <div className="w-full border border-gray-200 rounded-md flex items-center justify-center overflow-hidden px-8 py-20">
                    <EmptyState size="sm">
                        <EmptyState.Header pattern="none">
                            <EmptyState.FeaturedIcon color="success" theme="light">
                                <AlertCircle className="h-6 w-6" />
                            </EmptyState.FeaturedIcon>
                        </EmptyState.Header>

                        <EmptyState.Content>
                            <EmptyState.Title className="text-gray-800">
                                No failed messages
                            </EmptyState.Title>
                            <EmptyState.Description className="text-gray-600">
                                Great news! You don't have any failed SMS messages at the moment.
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
                            title={`Failed Messages (${failedCount})`}
                        />

                        <Table className="react-aria-table w-full">
                            <Table.Header className="w-full border-y border-gray-200">
                                <Table.Row>
                                    <Table.Head>Date & Time</Table.Head>
                                    <Table.Head>Recipient</Table.Head>
                                    <Table.Head>Message</Table.Head>
                                    <Table.Head>Status</Table.Head>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body className="w-full">
                                {failedMessages.map((message, index) => (
                                    <Table.Row
                                        key={index}
                                        className="bg-white hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                                    >
                                        <Table.Cell className="text-sm text-gray-600">
                                            {formatDate(message.timestamp)}
                                        </Table.Cell>
                                        <Table.Cell className="font-medium text-gray-900">
                                            {message.recipient}
                                        </Table.Cell>
                                        <Table.Cell className="text-gray-600 max-w-md">
                                            <span
                                                className="block truncate"
                                                title={message.message}
                                            >
                                                {message.message}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge color="error" size="sm">
                                                Failed
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
                            Failed Messages ({failedCount})
                        </h2>
                        <div className="space-y-4">
                            {failedMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
                                >
                                    {/* Date and Status Row */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(message.timestamp)}
                                        </span>
                                        <Badge color="error" size="sm">
                                            Failed
                                        </Badge>
                                    </div>

                                    {/* Recipient */}
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Recipient
                                        </span>
                                        <p className="text-sm font-medium text-gray-900">
                                            {message.recipient}
                                        </p>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Message
                                        </span>
                                        <p className="text-sm text-gray-600 break-words">
                                            {message.message}
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

export default FailedSmsPage;