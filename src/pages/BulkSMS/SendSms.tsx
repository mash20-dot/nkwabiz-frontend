import { X, SendHorizontal, Users, ChevronDown } from "lucide-react";
import Button from "@/components/Button";
import classNames from "classnames";
import { TextArea } from "@/components/base/textarea/textarea";
import { useState, useRef, useEffect } from "react";
import { sendSms } from "@/utils/BulkSMS/smsService";
import { useSms } from "@/context/BulkSmsContext";
import { useContacts } from "@/context/ContactsContext";
import { toast } from "sonner";

type SendSMSProps = {
  showForm: boolean;
  closeForm: () => void;
};

const Summary = ({
  title,
  value,
  className,
  textColor,
}: {
  title: string;
  value: number | string;
  className?: string;
  textColor?: string;
}) => {
  const style = classNames("flex flex-row w-full justify-between", className);
  return (
    <div className={className ? style : "flex flex-row w-full justify-between"}>
      <span
        className={`font-normal text-sm text-start ${
          textColor ? textColor : "text-gray-600"
        }`}
      >
        {title}
      </span>
      <span
        className={`text-sm font-semibold text-end ${
          textColor ? textColor : "text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const SendSms = ({ showForm, closeForm }: SendSMSProps) => {
  const { smsData, refetch } = useSms();
  const { contacts, getAllCategories, getContactsByCategory } = useContacts();

  const [message, setMessage] = useState("");
  const [recipientsInput, setRecipientsInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const COST_PER_SMS = 0.025;
  const currentBalance = smsData?.total_sms || 0;
  const categories = getAllCategories();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check if category is selected
  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  // Toggle category selection
  const toggleCategorySelection = (category: string) => {
    if (isCategorySelected(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Remove selected category tag
  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  // Get all contacts from selected categories
  const getContactsFromSelectedCategories = (): string[] => {
    const categoryContacts = selectedCategories.flatMap((category) =>
      getContactsByCategory(category).map((c) => c.contact)
    );
    return [...new Set(categoryContacts)];
  };

  // Parse manual recipients from textarea
  const parseRecipients = (input: string): string[] => {
    if (!input.trim()) return [];

    const recipients = input
      .split(/[,\n\s]+/)
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    return [...new Set(recipients)];
  };

  // Get all recipients (selected categories + manual)
  const categoryContactNumbers = getContactsFromSelectedCategories();
  const manualNumbers = parseRecipients(recipientsInput);
  const allRecipients = [
    ...new Set([...categoryContactNumbers, ...manualNumbers]),
  ];

  const recipientCount = allRecipients.length;
  const estimatedCost = recipientCount * COST_PER_SMS;
  const hasEnoughBalance = currentBalance >= recipientCount;

  // Validate phone numbers
  const validateNumber = (number: string): boolean => {
    const cleaned = number.replace(/[\s-]/g, "");
    const ghanaPattern = /^(0[2-5][0-9]{8}|233[2-5][0-9]{8})$/;
    return ghanaPattern.test(cleaned);
  };

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    // Validation
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }

    if (allRecipients.length === 0) {
      setError("Please add at least one recipient");
      return;
    }

    // Validate all recipients are Ghana numbers
    const invalidNumbers = allRecipients.filter((num) => !validateNumber(num));
    if (invalidNumbers.length > 0) {
      setError(
        `Invalid Ghana phone numbers: ${invalidNumbers.slice(0, 3).join(", ")}${
          invalidNumbers.length > 3 ? "..." : ""
        }`
      );
      return;
    }

    if (!hasEnoughBalance) {
      setError(
        `Insufficient balance. You need ${recipientCount} SMS credits but only have ${currentBalance}`
      );
      return;
    }

    try {
      setSending(true);

      await sendSms(allRecipients, message);

      setSuccess(
        `Successfully queued ${recipientCount} SMS message${
          recipientCount > 1 ? "s" : ""
        }`
      );

      // Reset form
      setMessage("");
      setRecipientsInput("");
      setSelectedCategories([]);

      // Refresh SMS data
      await refetch();

      // Close form after 2 seconds
      setTimeout(() => {
        closeForm();
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send SMS. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setRecipientsInput("");
    setSelectedCategories([]);
    setError(null);
    setSuccess(null);
    closeForm();
  };

  return (
    <div
      className={
        !showForm ? "hidden" : "flex flex-col items-start justify-center gap-6"
      }
    >
      {/* Page Header */}
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-medium text-gray-900">Send Bulk SMS</h1>
          <p className="text-sm font-normal text-gray-600">
            Compose your message and send to multiple recipients.
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="cursor-pointer" onClick={handleClose}>
            <X className="h-4 w-4 mr-2 text-gray-600" aria-hidden="true" />
            Close
          </Button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error &&
        // <div className="w-full p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
        //   <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
        //   <div className="flex-1">
        //     <p className="text-sm font-medium text-red-800">Error</p>
        //     <p className="text-sm text-red-700">{error}</p>
        //   </div>
        // </div>
        toast.error(error)}

      {success &&
        // <div className="w-full p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3">
        //   <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
        //   <div className="flex-1">
        //     <p className="text-sm font-medium text-green-800">Success</p>
        //     <p className="text-sm text-green-700">{success}</p>
        //   </div>
        // </div>
        toast.success(success)}

      {/* Form Area */}
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-6">
        <div className="flex flex-col gap-6 w-full p-0 md:p-6 lg:p-6 bg-none md:bg-white border-0 md:border lg:border border-gray-200 md:shadow-sm lg:shadow-sm rounded-none md:rounded-md">
          {/* Message */}
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-gray-800">Message</h2>
            <TextArea
              isRequired
              placeholder="Type your message here..."
              rows={8}
              value={message}
              onChange={(value) => setMessage(value)}
            />
            <p className="text-xs text-gray-500">{message.length} characters</p>
          </div>

          {/* Recipients */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium text-gray-800">Recipients</h2>
              <p className="text-xs font-normal text-gray-400">
                Select contact categories or enter phone numbers manually.
              </p>
            </div>

            {/* Category Selection with Tags Inside */}
            {contacts.length > 0 && categories.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-800">
                    Select Contact Categories ({categories.length} available)
                  </p>
                </div>

                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={classNames(
                        "min-h-11 w-full flex flex-wrap items-center gap-2 px-3 py-2 bg-white border rounded-lg shadow-sm cursor-pointer transition-colors",
                        isDropdownOpen
                          ? "border-blue-500 ring-2 ring-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {/* Selected Category Tags */}
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((category) => {
                          const count = getContactsByCategory(category).length;
                          return (
                            <span
                              key={category}
                              className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="truncate max-w-[150px]">
                                {category} ({count})
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCategory(category);
                                }}
                                className="hover:bg-blue-100 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-sm text-gray-400">
                          Select categories...
                        </span>
                      )}

                      {/* Chevron Icon */}
                      <ChevronDown
                        className={classNames(
                          "ml-auto h-4 w-4 text-gray-400 transition-transform",
                          isDropdownOpen && "transform rotate-180"
                        )}
                      />
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {categories.length > 0 ? (
                          <div className="py-1">
                            {categories.map((category) => {
                              const isSelected = isCategorySelected(category);
                              const count =
                                getContactsByCategory(category).length;
                              return (
                                <div
                                  key={category}
                                  onClick={() =>
                                    toggleCategorySelection(category)
                                  }
                                  className={classNames(
                                    "px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                                    isSelected && "bg-blue-50"
                                  )}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {category}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {count} contact{count !== 1 ? "s" : ""}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded text-white">
                                      <svg
                                        className="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="px-3 py-8 text-center text-sm text-gray-500">
                            No categories found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {selectedCategories.length} categor
                  {selectedCategories.length !== 1 ? "ies" : "y"} selected
                  {categoryContactNumbers.length > 0 &&
                    ` • ${categoryContactNumbers.length} contact${
                      categoryContactNumbers.length !== 1 ? "s" : ""
                    }`}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-xs text-gray-600">
                  💡 No saved contacts yet. You can add contacts from the
                  Contacts page.
                </p>
              </div>
            )}

            {/* Manual Recipients Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Or Enter Phone Numbers Manually
              </label>
              <TextArea
                placeholder="0241234567, 0551234567, 0201234567..."
                rows={6}
                value={recipientsInput}
                onChange={(value) => setRecipientsInput(value)}
              />
              <p className="text-xs text-gray-500">
                Enter phone numbers separated by commas, spaces, or new lines.
              </p>
              {manualNumbers.length > 0 && (
                <p className="text-xs text-gray-700 font-medium">
                  {manualNumbers.length} manual recipient
                  {manualNumbers.length !== 1 ? "s" : ""} entered
                </p>
              )}
            </div>

            {/* Total Recipients Summary */}
            {recipientCount > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-semibold text-blue-800">
                  Total: {recipientCount} recipient
                  {recipientCount !== 1 ? "s" : ""}
                </p>
                {categoryContactNumbers.length > 0 &&
                  manualNumbers.length > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      ({categoryContactNumbers.length} from categories +{" "}
                      {manualNumbers.length} manual)
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="flex p-5 rounded-md shadow-sm flex-col gap-6 h-auto min-w-2xs bg-white border border-gray-200">
          <h2 className="text-lg font-medium text-gray-800">Cost Summary</h2>
          <div className="flex flex-col gap-4 w-full">
            <Summary
              title="Cost per SMS"
              value={`GH₵${COST_PER_SMS.toFixed(3)}`}
            />
            <Summary title="Total Recipients" value={recipientCount} />
            <hr className="bg-gray-200" />
            <Summary
              title="Estimated Cost"
              value={`GH₵${estimatedCost.toFixed(2)}`}
            />
            <Summary
              className={classNames("p-2 rounded-sm", {
                "bg-blue-100": hasEnoughBalance,
                "bg-red-100": !hasEnoughBalance && recipientCount > 0,
              })}
              textColor={
                hasEnoughBalance
                  ? "text-blue-600"
                  : recipientCount > 0
                  ? "text-red-600"
                  : "text-gray-600"
              }
              title="Current Balance"
              value={`${currentBalance} SMS`}
            />
          </div>

          {!hasEnoughBalance && recipientCount > 0 && (
            <p className="text-xs text-red-600">
              Insufficient balance. Please top up to send messages.
            </p>
          )}

          <Button
            className={classNames(
              "items-center justify-center text-white cursor-pointer",
              {
                "bg-blue-600 hover:bg-blue-700":
                  !sending && hasEnoughBalance && recipientCount > 0,
                "bg-gray-400 cursor-not-allowed":
                  sending || !hasEnoughBalance || recipientCount === 0,
              }
            )}
            onClick={handleSend}
            disabled={
              sending || !hasEnoughBalance || recipientCount === 0 || !message
            }
          >
            {sending ? (
              <>
                <div className="h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <SendHorizontal className="h-4 w-4 mr-2 text-white" />
                Send Message
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SendSms;
