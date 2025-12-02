import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyPayment,
  PaymentVerificationResponse,
} from "@/utils/BulkSMS/smsService";
import Button from "@/components/Button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      localStorage.getItem("payment_reference");

    if (!reference) {
      setError("No payment reference found");
      setVerifying(false);
      return;
    }

    async function verify() {
      try {
        const result = await verifyPayment(reference);
        setVerificationResult(result);

        // Clear the saved reference
        localStorage.removeItem("payment_reference");
      } catch (err) {
        setError("Failed to verify payment");
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    }

    // Add a small delay for better UX
    const timer = setTimeout(() => {
      verify();
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams]);

  const handleContinue = () => {
    navigate("/sms/dashboard");
  };

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !verificationResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Unable to verify your payment. Please contact support."}
          </p>
          <Button
            onClick={() => navigate("/sms/topup")}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Back to Top Up
          </Button>
        </div>
      </div>
    );
  }

  const isSuccess = verificationResult.payment_status === "success";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isSuccess ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Your SMS credits have been added to your account.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  GH₵{verificationResult.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Current SMS Balance:</span>
                <span className="font-semibold text-green-600 text-lg">
                  {verificationResult.current_sms_balance.toLocaleString()} SMS
                </span>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to Dashboard
            </Button>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-6">
              {verificationResult.message ||
                "Your payment could not be processed."}
            </p>
            <Button
              onClick={() => navigate("/sms/topup")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;
