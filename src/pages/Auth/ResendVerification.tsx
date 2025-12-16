import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import Button from "../../components/Button";
import SEO from "../LandingPage/SEO";

const ResendVerification = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/security/resend-verification`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
            } else {
                setError(data.message || "Failed to resend verification email");
            }
        } catch (error) {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <SEO
                    title="Verification Email Sent - Nkwabiz"
                    description="Check your email for the verification link"
                    canonical="https://www.nkwabiz.com/resend-verification"
                    noindex={true}
                />

                <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                            <div className="text-center">
                                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                    <Mail className="h-8 w-8 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Verification Email Sent!
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    We've sent a new verification link to:
                                </p>
                                <p className="text-lg font-semibold text-blue-600 bg-blue-50 py-2 px-4 rounded-md mb-6">
                                    {email}
                                </p>

                                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                                    <p className="text-sm text-gray-700 font-medium mb-2">
                                        Next steps:
                                    </p>
                                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                        <li>Check your inbox for the verification email</li>
                                        <li>Click the verification link</li>
                                        <li>If you don't see it, check your spam folder</li>
                                    </ul>
                                </div>

                                <Button
                                    onClick={() => navigate("/login")}
                                    className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md"
                                >
                                    Go to Login
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <SEO
                title="Resend Verification Email - Nkwabiz"
                description="Request a new verification email for your Nkwabiz account"
                canonical="https://www.nkwabiz.com/resend-verification"
                noindex={true}
            />

            <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <Link
                        to="/login"
                        className="flex items-center text-blue-600 hover:text-blue-500 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Login
                    </Link>

                    <h2 className="text-center text-xl font-extrabold text-blue-600">
                        NkwaBiz
                    </h2>
                    <p className="mt-2 text-center text-2xl font-medium text-gray-900">
                        Resend Verification Email
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg sm:px-10">
                        <p className="text-center text-gray-600 mb-6">
                            Enter your email address and we'll send you a new verification link.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="your@email.com"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md flex justify-center focus:ring-blue-500"
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"
                                        />
                                    </svg>
                                ) : (
                                    "Send Verification Email"
                                )}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Remember your password?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResendVerification;