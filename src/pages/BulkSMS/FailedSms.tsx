import { useState, useEffect } from "react";
import { AlertCircle, Loader2, RefreshCw, Copy, Check } from "lucide-react";

// Types
interface FailedSMS {
    recipient: string;
    message: string;
    timestamp: string;
}

interface FailedSMSResponse {
    failed_count: number;
    failed_messages: FailedSMS[];
}

// Mock API function - replace with your actual implementation
const getFailedSMS = async (): Promise<FailedSMSResponse> => {
    // Simulated API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                failed_count: 3,
                failed_messages: [
                    {
                        recipient: "+233241234567",
                        message: "Your verification code is 123456",
                        timestamp: "2024-12-16T10:30:00Z"
                    },
                    {
                        recipient: "+233501234567",
                        message: "Welcome to our service!",
                        timestamp: "2024-12-16T09:15:00Z"
                    },
                    {
                        recipient: "+233261234567",
                        message: "Your order has been confirmed",
                        timestamp: "2024-12-16T08:45:00Z"
                    }
                ]
            });
        }, 1000);
    });
};

const FailedSmsPage = () => {
    const [failedMessages, setFailedMessages] = useState<FailedSMS[]>([]);
    const [failedCount, setFailedCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const handleCopy = async (recipient: string, index: number) => {
        try {
            await navigator.clipboard.writeText(recipient);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
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
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-start gap-6 w-full p-6">
            {/* Page Header */}
            <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Failed SMS Messages</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Review SMS messages that failed to deliver
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* Statistics Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 w-full md:w-auto shadow-sm">
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
                <div className="w-full border border-gray-200 rounded-lg bg-white flex items-center justify-center px-8 py-20">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                            <AlertCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                            No failed messages
                        </h3>
                        <p className="text-sm text-gray-600">
                            Great news! You don't have any failed SMS messages at the moment.
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 bg-white">
                            <h2 className="text-lg font-medium text-gray-800">
                                Failed Messages ({failedCount})
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Recipient
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Message
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {failedMessages.map((message, index) => (
                                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(message.timestamp)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900">
                                                        {message.recipient}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(message.recipient, index)}
                                                        className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                                                        title="Copy number"
                                                    >
                                                        {copiedIndex === index ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                                                <span className="block truncate" title={message.message}>
                                                    {message.message}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Failed
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden w-full">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">
                            Failed Messages ({failedCount})
                        </h2>
                        <div className="space-y-4">
                            {failedMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm"
                                >
                                    {/* Date and Status Row */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            {formatDate(message.timestamp)}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Failed
                                        </span>
                                    </div>

                                    {/* Recipient */}
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 block mb-1">
                                            Recipient
                                        </span>
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {message.recipient}
                                            </p>
                                            <button
                                                onClick={() => handleCopy(message.recipient, index)}
                                                className="p-2 hover:bg-gray-100 rounded transition-colors"
                                                title="Copy number"
                                            >
                                                {copiedIndex === index ? (
                                                    <Check className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <Copy className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
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