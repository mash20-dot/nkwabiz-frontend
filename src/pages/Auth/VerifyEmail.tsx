import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "../../components/Button";
import SEO from "../LandingPage/SEO";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("");
    const hasRunRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Prevent double execution in React.StrictMode (development)
        if (hasRunRef.current) {
            console.log("⚠️ Verification already running, preventing duplicate");
            return;
        }
        hasRunRef.current = true;

        const verifyEmail = async () => {
            const token = searchParams.get("token");

            console.log("=== VERIFICATION START ===");
            console.log("Token:", token);
            console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

            if (!token) {
                console.log("❌ No token found");
                setStatus("error");
                setMessage("Invalid verification link. No token provided.");
                return;
            }

            try {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/security/verify-email?token=${token}`;
                console.log("Calling:", apiUrl);

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log("Response status:", response.status);
                const data = await response.json();
                console.log("Response data:", data);

                if (response.ok) {
                    console.log("✅ SUCCESS!");
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");

                    // Use ref to store timeout so we can clean it up
                    timeoutRef.current = setTimeout(() => {
                        console.log("Redirecting to login...");
                        navigate("/login", {
                            state: { verified: true },
                            replace: true  // Use replace to avoid back button issues
                        });
                    }, 3000);
                } else if (response.status === 400) {
                    console.log("❌ Verification failed:", data.message);

                    // Check if already verified
                    if (data.message?.toLowerCase().includes("already")) {
                        setStatus("success");
                        setMessage("Your email is already verified. You can log in now.");

                        timeoutRef.current = setTimeout(() => {
                            navigate("/login", { replace: true });
                        }, 2000);
                    } else {
                        setStatus("error");

                        if (data.message?.toLowerCase().includes("expired")) {
                            setMessage("This verification link has expired. Please request a new one.");
                        } else if (data.message?.toLowerCase().includes("invalid")) {
                            setMessage("Invalid verification link. Please request a new one.");
                        } else {
                            setMessage(data.message || "Verification failed. Please try again.");
                        }
                    }
                } else {
                    console.log("❌ Unexpected error");
                    setStatus("error");
                    setMessage(data.message || "Verification failed. Please try again.");
                }
            } catch (error: any) {
                console.error("❌ NETWORK ERROR:", error);
                console.error("Error details:", error.message);
                setStatus("error");
                setMessage(`Network error: ${error.message}. Please check your connection.`);
            }

            console.log("=== VERIFICATION END ===");
        };

        verifyEmail();

        // Cleanup function - cancel redirect if component unmounts
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                console.log("Cleanup: Cleared timeout");
            }
        };
    }, [searchParams, navigate]);

    return (
        <>
            <SEO
                title="Verify Email - Nkwabiz"
                description="Verify your email address to activate your Nkwabiz account"
                canonical="https://www.nkwabiz.com/verify-email"
                noindex={true}
            />

            <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                        {/* Verifying State */}
                        {status === "verifying" && (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verifying Your Email
                                </h2>
                                <p className="text-gray-600">
                                    Please wait while we verify your email address...
                                </p>
                                <p className="text-xs text-gray-400 mt-4">
                                    This should only take a moment
                                </p>
                            </div>
                        )}

                        {/* Success State */}
                        {status === "success" && (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Email Verified!
                                </h2>
                                <p className="text-gray-600 mb-4">{message}</p>
                                <div className="bg-green-50 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-green-800">
                                        Your account is now active. Redirecting to login page...
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        if (timeoutRef.current) {
                                            clearTimeout(timeoutRef.current);
                                        }
                                        navigate("/login", { replace: true });
                                    }}
                                    className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md"
                                >
                                    Go to Login Now
                                </Button>
                            </div>
                        )}

                        {/* Error State */}
                        {status === "error" && (
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                                    <XCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verification Failed
                                </h2>
                                <p className="text-gray-600 mb-4">{message}</p>

                                <div className="bg-red-50 rounded-lg p-4 mb-6 text-left">
                                    <p className="text-sm text-red-800 font-medium mb-2">
                                        Common reasons:
                                    </p>
                                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                                        <li>The verification link has expired</li>
                                        <li>The link has already been used</li>
                                        <li>The link is invalid or corrupted</li>
                                        <li>Network connection issues</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate("/resend-verification")}
                                        className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md"
                                    >
                                        Request New Verification Email
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/login")}
                                        className="w-full bg-gray-200 border-transparent shadow-sm hover:bg-gray-300 text-gray-700 rounded-md"
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;