import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  verifyPayment,
  PaymentVerificationResponse,
} from "@/utils/BulkSMS/smsService";
import Button from "@/components/Button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verificationResult, setVerificationResult] =
    useState<PaymentVerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const reference =
      searchParams.get("reference") ||
      searchParams.get("trxref") ||
      localStorage.getItem("payment_reference");

    if (!reference) {
      setError("No payment reference found");
      setVerifying(false);
      return;
    }

    async function verify() {
      try {
        const result = await verifyPayment(reference as string);
        setVerificationResult(result);

        localStorage.removeItem("payment_reference");
      } catch (err) {
        setError("Failed to verify payment");
        console.error("Verification error:", err);
      } finally {
        setVerifying(false);
      }
    }

    verify();
  }, [searchParams]);

  const handleClose = () => {
    window.close();
    navigate("/sms/dashboard");
  };

  if (verifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
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
            onClick={handleClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            Close Window
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
              Your SMS credits have been added. You can safely close this
              window.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-semibold text-gray-900">
                  GH₵{verificationResult.amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Balance:</span>
                <span className="font-semibold text-green-600 text-lg">
                  {verificationResult.current_sms_balance.toLocaleString()} SMS
                </span>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close Window
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
              onClick={}
              className="w-full bg-blue-600 hover:bg-blue-700 items-center justify-center  text-white"
            >
              Close Window
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentVerification;
