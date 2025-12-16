import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "../../components/Button";
import SEO from "../LandingPage/SEO";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [message, setMessage] = useState("");

    // Component mount debug
    console.log("🚀 VerifyEmail Component MOUNTED!");
    console.log("🌐 Current URL:", window.location.href);
    console.log("🔑 Token from searchParams:", searchParams.get("token"));

    useEffect(() => {
        console.log("⚡ useEffect TRIGGERED!");

        const verifyEmail = async () => {
            const token = searchParams.get("token");

            console.log("=== VERIFICATION DEBUG START ===");
            console.log("1. Token from URL:", token);
            console.log("2. Full URL:", window.location.href);
            console.log("3. API Base URL:", import.meta.env.VITE_API_BASE_URL);

            if (!token) {
                console.log("❌ ERROR: No token found in URL");
                setStatus("error");
                setMessage("Invalid verification link. No token provided.");
                return;
            }

            try {
                const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/security/verify-email?token=${token}`;
                console.log("4. Calling API:", apiUrl);
                console.log("5. Making fetch request...");

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                console.log("6. Response received - Status:", response.status);
                const data = await response.json();
                console.log("7. Response data:", JSON.stringify(data, null, 2));

                if (response.ok) {
                    console.log("✅ SUCCESS: Email verified!");
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");

                    console.log("8. Will redirect to login in 3 seconds...");
                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        console.log("9. Redirecting to /login now");
                        navigate("/login", { state: { verified: true } });
                    }, 3000);
                } else if (response.status === 400 && data.message?.toLowerCase().includes("already")) {
                    // Handle already verified case
                    console.log("ℹ️ Email already verified");
                    setStatus("success");
                    setMessage("This email has already been verified. You can log in now.");

                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                } else {
                    console.log("❌ FAILED: Verification failed");
                    console.log("Error message:", data.message);
                    setStatus("error");

                    // Better error messages
                    if (data.message?.toLowerCase().includes("expired")) {
                        setMessage("This verification link has expired. Please request a new one.");
                    } else if (data.message?.toLowerCase().includes("used")) {
                        setMessage("This link has already been used. Please request a new verification link.");
                    } else if (data.message?.toLowerCase().includes("invalid")) {
                        setMessage("Invalid verification link. Please check your email or request a new link.");
                    } else {
                        setMessage(data.message || "Verification failed. Please try again.");
                    }
                }
            } catch (error: any) {
                console.error("❌ NETWORK ERROR:", error);
                console.error("Error details:", error.message);
                setStatus("error");
                setMessage("Network error. Please check your connection and try again.");
            }

            console.log("=== VERIFICATION DEBUG END ===");
        };

        verifyEmail();
    }, [searchParams, navigate]);

    console.log("🎨 Rendering with status:", status);

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
                                    onClick={() => navigate("/login")}
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
                                        Possible reasons:
                                    </p>
                                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                                        <li>The verification link has expired</li>
                                        <li>The link has already been used</li>
                                        <li>The link is invalid or corrupted</li>
                                    </ul>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        onClick={() => navigate("/resend-verification")}
                                        className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md"
                                    >
                                        Resend Verification Email
                                    </Button>
                                    <Button
                                        onClick={() => navigate("/signup")}
                                        className="w-full bg-gray-200 border-transparent shadow-sm hover:bg-gray-300 text-gray-700 rounded-md"
                                    >
                                        Back to Signup
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