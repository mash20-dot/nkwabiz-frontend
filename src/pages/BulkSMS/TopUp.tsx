import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import {
  getSMSBundles,
  initializeSMSPayment,
  SmsBundle,
} from "@/utils/BulkSMS/smsService";
import { CreditCard, Check, Loader2 } from "lucide-react";

const TopUp = () => {
  const [bundles, setBundles] = useState<SmsBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBundles() {
      try {
        const data = await getSMSBundles();
        setBundles(data);
      } catch (err) {
        setError("Failed to load SMS bundles");
      } finally {
        setLoading(false);
      }
    }

    fetchBundles();
  }, []);

  const handlePurchase = async (
    bundleType: "small" | "medium" | "large" | "xl",
  ) => {
    try {
      setProcessingPayment(true);
      setSelectedBundle(bundleType);

      console.log("Initializing payment for bundle:", bundleType);

      const response = await initializeSMSPayment(bundleType);

      console.log("Full payment response:", JSON.stringify(response, null, 2));
      console.log("Paystack data:", response.paystack_data);
      console.log(
        "Authorization URL:",
        response.paystack_data?.authorization_url,
      );

      // Check if we have the authorization URL
      if (!response.paystack_data?.authorization_url) {
        throw new Error("No authorization URL received from backend");
      }

      // Save reference to localStorage for verification page
      localStorage.setItem(
        "payment_reference",
        response.paystack_data.reference,
      );

      // Redirect to Paystack payment page
      console.log("Redirecting to:", response.paystack_data.authorization_url);
      window.location.href = response.paystack_data.authorization_url;
    } catch (err) {
      console.error("Failed to initialize payment:", err);
      alert("Failed to initialize payment. Please try again.");
      setProcessingPayment(false);
      setSelectedBundle(null);
    }
  };

  const getBundleColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "small":
        return "blue";
      case "medium":
        return "green";
      case "large":
        return "purple";
      case "xl":
        return "orange";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      {/* Page Header */}
      <div className="w-full">
        <h1 className="text-2xl font-medium text-gray-900">
          Top Up SMS Credits
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Choose a bundle to purchase SMS credits
        </p>
      </div>

      {/* Bundles Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bundles.map((bundle) => {
          const color = getBundleColor(bundle.name);
          const isSelected = selectedBundle === bundle.name.toLowerCase();
          const isProcessing = processingPayment && isSelected;

          return (
            <div
              key={bundle.id}
              className={`relative bg-white border-2 rounded-xl p-6 transition-all hover:shadow-lg ${
                isSelected
                  ? "border-blue-500 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Popular Badge for Medium bundle */}
              {bundle.name.toLowerCase() === "medium" && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    POPULAR
                  </span>
                </div>
              )}

              <div className="flex flex-col h-full">
                {/* Bundle Name */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 capitalize">
                    {bundle.name}
                  </h3>
                </div>

                {/* SMS Credits */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    {bundle.sms_credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">SMS Credits</div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      GH₵{bundle.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    GH₵{bundle.price_per_sms.toFixed(4)} per SMS
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6 space-y-2 flex-grow">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Valid for 12 months
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      Instant credit top-up
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      No expiry on credits
                    </span>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={() =>
                    handlePurchase(bundle.name.toLowerCase() as any)
                  }
                  disabled={processingPayment}
                  className={`w-full flex items-center justify-center ${
                    isProcessing
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Purchase Bundle
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Security Notice */}
      <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">
              Secure Payment by Paystack
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Your payment information is encrypted and secure. You'll be
              redirected to Paystack to complete your purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
