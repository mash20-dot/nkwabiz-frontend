import React, { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { useContacts } from "@/context/ContactsContext";
import Button from "@/components/Button";

interface ImportContactsModalProps {
    onClose: () => void;
    onSuccess: (message: string) => void;
    onError: (message: string) => void;
}

interface ParsedContact {
    phone: string;
    category?: string;
    valid: boolean;
    error?: string;
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({
    onClose,
    onSuccess,
    onError,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
    const [showPreview, setShowPreview] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { addNewContact, getAllCategories } = useContacts();
    const existingCategories = getAllCategories();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
            if (fileExtension === "csv" || fileExtension === "txt") {
                setFile(selectedFile);
                parseFile(selectedFile);
            } else {
                onError("Please upload a CSV or TXT file");
            }
        }
    };

    const parseFile = (file: File) => {
        setIsProcessing(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split(/\r?\n/).filter((line) => line.trim());

            const contacts: ParsedContact[] = lines.map((line) => {
                // Remove any non-digit characters and validate
                const phone = line.trim().replace(/[^0-9]/g, "");

                if (!phone) {
                    return { phone: line, valid: false, error: "Empty line" };
                }

                if (phone.length < 10) {
                    return { phone, valid: false, error: "Phone number too short" };
                }

                if (phone.length > 15) {
                    return { phone, valid: false, error: "Phone number too long" };
                }

                return { phone, valid: true };
            });

            setParsedContacts(contacts);
            setShowPreview(true);
            setIsProcessing(false);
        };

        reader.onerror = () => {
            onError("Failed to read file");
            setIsProcessing(false);
        };

        reader.readAsText(file);
    };

    const handleImport = async () => {
        if (!category.trim()) {
            onError("Please enter a category name");
            return;
        }

        const validContacts = parsedContacts.filter((c) => c.valid);

        if (validContacts.length === 0) {
            onError("No valid contacts to import");
            return;
        }

        setIsProcessing(true);
        let successCount = 0;
        let failCount = 0;

        try {
            for (const contact of validContacts) {
                try {
                    await addNewContact(contact.phone, category);
                    successCount++;
                } catch (err) {
                    console.error(`Failed to add ${contact.phone}:`, err);
                    failCount++;
                }
            }

            if (successCount > 0) {
                onSuccess(
                    `Successfully imported ${successCount} contact${successCount > 1 ? "s" : ""}${failCount > 0 ? `. ${failCount} failed.` : ""
                    }`
                );
            } else {
                onError("Failed to import contacts");
            }
        } catch (err) {
            onError("An error occurred during import");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadTemplate = () => {
        const template = `233501234567
233509876543
233201112222
233307654321`;

        const blob = new Blob([template], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "contacts_template.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const validCount = parsedContacts.filter((c) => c.valid).length;
    const invalidCount = parsedContacts.length - validCount;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Import Contacts
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Upload a CSV or TXT file with phone numbers
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Download Template */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-blue-900">
                                    Need a template?
                                </h3>
                                <p className="text-sm text-blue-700 mt-1">
                                    Download our sample file format to see how to structure your contacts.
                                </p>
                                <button
                                    onClick={downloadTemplate}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload File
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">
                                {file ? (
                                    <span className="text-blue-600 font-medium">{file.name}</span>
                                ) : (
                                    <>
                                        Click to upload or drag and drop
                                        <br />
                                        <span className="text-xs text-gray-500">CSV or TXT files only</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Category Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="e.g., Customers, Friends, VIP"
                            list="existing-categories"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        {existingCategories.length > 0 && (
                            <datalist id="existing-categories">
                                {existingCategories.map((cat) => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                        )}
                    </div>

                    {/* Preview */}
                    {showPreview && parsedContacts.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-gray-700">Preview</h3>

                            {/* Stats */}
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span className="text-gray-700">
                                        {validCount} valid contact{validCount !== 1 ? "s" : ""}
                                    </span>
                                </div>
                                {invalidCount > 0 && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                        <span className="text-gray-700">
                                            {invalidCount} invalid
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Contacts List */}
                            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                                {parsedContacts.slice(0, 50).map((contact, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between px-4 py-2 border-b last:border-b-0 ${contact.valid ? "bg-white" : "bg-red-50"
                                            }`}
                                    >
                                        <span
                                            className={`text-sm ${contact.valid ? "text-gray-800" : "text-red-600"
                                                }`}
                                        >
                                            {contact.phone}
                                        </span>
                                        {contact.valid ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-red-600">
                                                    {contact.error}
                                                </span>
                                                <AlertCircle className="h-4 w-4 text-red-600" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {parsedContacts.length > 50 && (
                                    <div className="px-4 py-2 bg-gray-50 text-sm text-gray-600 text-center">
                                        Showing first 50 of {parsedContacts.length} contacts
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <Button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={isProcessing || !file || !category.trim() || validCount === 0}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4 mr-2" />
                                Import {validCount > 0 ? `${validCount} Contact${validCount > 1 ? "s" : ""}` : ""}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ImportContactsModal;