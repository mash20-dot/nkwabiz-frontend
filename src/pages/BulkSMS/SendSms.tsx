import { X, SendHorizontal, Users, ChevronDown, Info, Clock } from "lucide-react";
import Button from "@/components/Button";
import classNames from "classnames";
import { TextArea } from "@/components/base/textarea/textarea";
import { useState, useRef, useEffect } from "react";
import { sendSms, getContactCategories, CategoryInfo } from "@/utils/BulkSMS/smsService";
import { useSms } from "@/context/BulkSmsContext";
import { useAuthStore } from "@/store/useAuthStore";
import { apiFetch } from "@/utils/api";
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
        className={`font-normal text-sm text-start ${textColor ? textColor : "text-gray-600"}`}
      >
        {title}
      </span>
      <span
        className={`text-sm font-semibold text-end ${textColor ? textColor : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
};

const SendSms = ({ showForm, closeForm }: SendSMSProps) => {
  const { refetch } = useSms();
  const { smsBalance, setSmsBalance } = useAuthStore();

  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [recipientsInput, setRecipientsInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSenderIdDropdownOpen, setIsSenderIdDropdownOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // NEW: Category state
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [totalContacts, setTotalContacts] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const senderIdDropdownRef = useRef<HTMLDivElement>(null);

  const COST_PER_SMS = 0.04;
  const MAX_RECIPIENTS_PER_BULK = 80;
  const STORAGE_KEY = 'sms_sender_ids';
  const currentBalance = smsBalance || 0;

  const [previousSenderIds, setPreviousSenderIds] = useState<string[]>([]);

  // NEW: Load categories on mount (INSTANT!)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const data = await getContactCategories();
        setCategories(data.categories);
        setTotalContacts(data.total_contacts);
        console.log(`✅ Loaded ${data.categories.length} categories with ${data.total_contacts} total contacts`);
      } catch (error) {
        console.error("Failed to load categories:", error);
        toast.error("Failed to load contact categories");
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (showForm) {
      loadCategories();
    }
  }, [showForm]);

  // Load previous sender IDs from localStorage
  useEffect(() => {
    const loadSenderIds = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const ids = JSON.parse(stored);
          setPreviousSenderIds(ids);
          if (ids.length > 0 && !senderId) {
            setSenderId(ids[0]);
          }
        }
      } catch (error) {
        console.log('No previous sender IDs found');
      }
    };
    loadSenderIds();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        senderIdDropdownRef.current &&
        !senderIdDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSenderIdDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  const toggleCategorySelection = (category: string) => {
    if (isCategorySelected(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  // NEW: Calculate total contacts from selected categories
  const getCategoryContactCount = (): number => {
    return selectedCategories.reduce((total, category) => {
      const cat = categories.find(c => c.category === category);
      return total + (cat?.count || 0);
    }, 0);
  };

  const parseRecipients = (input: string): string[] => {
    if (!input.trim()) return [];

    const recipients = input
      .split(/[,\n\s]+/)
      .map((num) => num.trim())
      .filter((num) => num.length > 0);

    return [...new Set(recipients)];
  };

  const categoryContactCount = getCategoryContactCount();
  const manualNumbers = parseRecipients(recipientsInput);
  const allRecipients = [
    ...new Set([...manualNumbers]),
  ];

  // Total recipients = category count + manual numbers
  const recipientCount = categoryContactCount + manualNumbers.length;
  const estimatedCost = recipientCount * COST_PER_SMS;
  const hasEnoughBalance = currentBalance >= recipientCount;
  const exceedsMaxRecipients = recipientCount > MAX_RECIPIENTS_PER_BULK;

  const validateNumber = (number: string): boolean => {
    const cleaned = number.replace(/[\s-]/g, "");
    const ghanaPattern = /^(0[2-5][0-9]{8}|233[2-5][0-9]{8})$/;
    return ghanaPattern.test(cleaned);
  };

  const validateSenderId = (id: string): boolean => {
    return /^[a-zA-Z0-9]{3,11}$/.test(id);
  };

  const handleSend = async () => {
    if (!senderId.trim()) {
      toast.error("Please enter a Sender ID", {
        duration: 5000,
        closeButton: true,
      });
      return;
    }

    if (!validateSenderId(senderId)) {
      toast.error("Sender ID must be 3-11 alphanumeric characters (no spaces or special characters)", {
        duration: 7000,
        closeButton: true,
      });
      return;
    }

    if (!message.trim()) {
      toast.error("Please enter a message", {
        duration: 5000,
        closeButton: true,
      });
      return;
    }

    if (recipientCount === 0) {
      toast.error("Please select at least one category or add recipients", {
        duration: 5000,
        closeButton: true,
      });
      return;
    }

    if (recipientCount > MAX_RECIPIENTS_PER_BULK) {
      toast.error(`Maximum ${MAX_RECIPIENTS_PER_BULK} recipients allowed per bulk SMS`, {
        description: `You have ${recipientCount} recipients. Please reduce to ${MAX_RECIPIENTS_PER_BULK} or fewer.`,
        duration: 7000,
        closeButton: true,
      });
      return;
    }

    // Validate manual recipients
    if (manualNumbers.length > 0) {
      const invalidNumbers = manualNumbers.filter((num) => !validateNumber(num));
      if (invalidNumbers.length > 0) {
        toast.error(
          `Invalid Ghana phone numbers: ${invalidNumbers.slice(0, 3).join(", ")}${invalidNumbers.length > 3 ? "..." : ""}`,
          {
            duration: 7000,
            closeButton: true,
          }
        );
        return;
      }
    }

    if (!hasEnoughBalance) {
      toast.error(
        `Insufficient balance. You need ${recipientCount} SMS credits but only have ${currentBalance}`,
        {
          duration: 7000,
          closeButton: true,
        }
      );
      return;
    }

    try {
      setSending(true);

      let response;

      // NEW: If categories are selected, send to entire categories
      if (selectedCategories.length > 0 && manualNumbers.length === 0) {
        // Send to categories only
        console.log(`📤 Sending to ${selectedCategories.length} categories: ${selectedCategories.join(", ")}`);

        // Send to each category
        for (const category of selectedCategories) {
          const catResponse = await sendSms([], message, senderId, category);
          response = catResponse; // Keep last response for display
          console.log(`✅ Sent to category "${category}": ${catResponse.queued} messages queued`);
        }
      } else if (selectedCategories.length > 0 && manualNumbers.length > 0) {
        // Mixed: categories + manual numbers
        // First send to categories
        for (const category of selectedCategories) {
          await sendSms([], message, senderId, category);
        }
        // Then send to manual numbers
        response = await sendSms(manualNumbers, message, senderId);
      } else {
        // Manual numbers only
        response = await sendSms(manualNumbers, message, senderId);
      }

      // Save sender ID
      const trimmedSenderId = senderId.trim();
      const updatedIds = [
        trimmedSenderId,
        ...previousSenderIds.filter(id => id !== trimmedSenderId)
      ].slice(0, 10);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedIds));
        setPreviousSenderIds(updatedIds);
      } catch (error) {
        console.error('Failed to save sender ID:', error);
      }

      toast.success(
        `Successfully queued ${recipientCount} SMS message${recipientCount > 1 ? "s" : ""}!`,
        {
          description: response?.message || "Messages are being sent",
          duration: Infinity,
          closeButton: true,
        }
      );

      if (response?.failed && response.failed > 0) {
        toast.warning(
          `${response.failed} message${response.failed > 1 ? "s" : ""} failed to queue`,
          {
            description: response?.errors?.join(", ") || "Some messages could not be sent",
            duration: Infinity,
            closeButton: true,
          }
        );
      }

      // Reset form
      setMessage("");
      setRecipientsInput("");
      setSelectedCategories([]);

      await refetch();

      try {
        const userData = await apiFetch("/security/user-info", {}, true);
        if (userData.sms_balance !== undefined) {
          setSmsBalance(userData.sms_balance);
        }
      } catch (error) {
        console.error("Failed to refresh balance:", error);
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to send SMS. Please try again.";

      toast.error("SMS Send Failed", {
        description: errorMessage,
        duration: Infinity,
        closeButton: true,
      });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage("");
    setSenderId("");
    setRecipientsInput("");
    setSelectedCategories([]);
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

      {/* Form Area */}
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-6">
        <div className="flex flex-col gap-6 w-full p-0 md:p-6 lg:p-6 bg-none md:bg-white border-0 md:border lg:border border-gray-200 md:shadow-sm lg:shadow-sm rounded-none md:rounded-md">
          {/* Sender ID Field */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-gray-800">Sender ID</h2>
              <span className="text-red-500 text-sm">*</span>
            </div>

            <div className="relative" ref={senderIdDropdownRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., YourBrand, MyShop, CompanyName"
                  value={senderId}
                  onChange={(e) => {
                    setSenderId(e.target.value);
                  }}
                  onFocus={() => previousSenderIds.length > 0 && setIsSenderIdDropdownOpen(true)}
                  maxLength={11}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
                {previousSenderIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsSenderIdDropdownOpen(!isSenderIdDropdownOpen)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronDown
                      className={classNames(
                        "h-4 w-4 transition-transform duration-200",
                        isSenderIdDropdownOpen && "transform rotate-180"
                      )}
                    />
                  </button>
                )}
              </div>

              {isSenderIdDropdownOpen && previousSenderIds.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="py-1">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Recently Used ({previousSenderIds.length})
                    </div>
                    {previousSenderIds.map((id, index) => (
                      <div
                        key={`${id}-${index}`}
                        onClick={() => {
                          setSenderId(id);
                          setIsSenderIdDropdownOpen(false);
                        }}
                        className={classNames(
                          "px-3 py-2.5 cursor-pointer hover:bg-blue-50 flex items-center justify-between transition-colors group",
                          senderId === id && "bg-blue-50 border-l-2 border-blue-600"
                        )}
                      >
                        <span className={classNames(
                          "text-sm font-medium",
                          senderId === id ? "text-blue-700" : "text-gray-900 group-hover:text-blue-600"
                        )}>
                          {id}
                        </span>
                        {senderId === id && (
                          <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded-full text-white">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex flex-col gap-1">
                <p className="text-xs text-blue-800 font-medium">
                  Sender ID Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside">
                  <li>3-11 characters only</li>
                  <li>Letters and numbers only (no spaces or special characters)</li>
                  <li>Example: NKWABIZ, MyShop123, CompanyGH</li>
                  {previousSenderIds.length > 0 && (
                    <li className="font-medium">Click the dropdown to reuse a previous Sender ID</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

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

            {/* Category Selection */}
            {categoriesLoading ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-sm text-gray-600">Loading categories...</p>
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-gray-600" />
                  <p className="text-sm font-medium text-gray-800">
                    Select Contact Categories ({categories.length} available, {totalContacts} total contacts)
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
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((category) => {
                          const cat = categories.find(c => c.category === category);
                          const count = cat?.count || 0;
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

                      <ChevronDown
                        className={classNames(
                          "ml-auto h-4 w-4 text-gray-400 transition-transform",
                          isDropdownOpen && "transform rotate-180"
                        )}
                      />
                    </div>

                    {isDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                        {categories.length > 0 ? (
                          <div className="py-1">
                            {categories.map((cat) => {
                              const isSelected = isCategorySelected(cat.category);
                              return (
                                <div
                                  key={cat.category}
                                  onClick={() => toggleCategorySelection(cat.category)}
                                  className={classNames(
                                    "px-3 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between",
                                    isSelected && "bg-blue-50"
                                  )}
                                >
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {cat.category}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {cat.count} contact{cat.count !== 1 ? "s" : ""}
                                    </p>
                                  </div>
                                  {isSelected && (
                                    <div className="flex items-center justify-center w-5 h-5 bg-blue-600 rounded text-white">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
                  {selectedCategories.length} categor{selectedCategories.length !== 1 ? "ies" : "y"} selected
                  {categoryContactCount > 0 && ` • ${categoryContactCount} contact${categoryContactCount !== 1 ? "s" : ""}`}
                </p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                <p className="text-xs text-gray-600">
                  💡 No saved contacts yet. You can add contacts from the Contacts page.
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
                  {manualNumbers.length} manual recipient{manualNumbers.length !== 1 ? "s" : ""} entered
                </p>
              )}
            </div>

            {/* Total Recipients Summary */}
            {recipientCount > 0 && (
              <div className={classNames(
                "p-3 border rounded-md",
                exceedsMaxRecipients
                  ? "bg-red-50 border-red-200"
                  : "bg-blue-50 border-blue-200"
              )}>
                <p className={classNames(
                  "text-sm font-semibold",
                  exceedsMaxRecipients ? "text-red-800" : "text-blue-800"
                )}>
                  Total: {recipientCount} recipient{recipientCount !== 1 ? "s" : ""}
                </p>
                {categoryContactCount > 0 && manualNumbers.length > 0 && (
                  <p className={classNames(
                    "text-xs mt-1",
                    exceedsMaxRecipients ? "text-red-600" : "text-blue-600"
                  )}>
                    ({categoryContactCount} from categories + {manualNumbers.length} manual)
                  </p>
                )}
                {categoryContactCount > 0 && manualNumbers.length === 0 && (
                  <p className={classNames(
                    "text-xs mt-1",
                    exceedsMaxRecipients ? "text-red-600" : "text-blue-600"
                  )}>
                    (All from {selectedCategories.length} selected categor{selectedCategories.length !== 1 ? "ies" : "y"})
                  </p>
                )}
                {exceedsMaxRecipients && (
                  <p className="text-xs text-red-700 font-medium mt-2 flex items-start gap-1">
                    <span className="text-red-600">⚠️</span>
                    <span>
                      Maximum {MAX_RECIPIENTS_PER_BULK} recipients allowed. Please remove {recipientCount - MAX_RECIPIENTS_PER_BULK} recipient{recipientCount - MAX_RECIPIENTS_PER_BULK !== 1 ? "s" : ""}.
                    </span>
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
            {exceedsMaxRecipients && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-700 font-medium">
                  ⚠️ Exceeds maximum of {MAX_RECIPIENTS_PER_BULK} recipients
                </p>
              </div>
            )}
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
                  !sending && hasEnoughBalance && recipientCount > 0 && senderId.trim() && !exceedsMaxRecipients,
                "bg-gray-400 cursor-not-allowed":
                  sending || !hasEnoughBalance || recipientCount === 0 || !senderId.trim() || exceedsMaxRecipients,
              }
            )}
            onClick={handleSend}
            disabled={
              sending || !hasEnoughBalance || recipientCount === 0 || !message || !senderId.trim() || exceedsMaxRecipients
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