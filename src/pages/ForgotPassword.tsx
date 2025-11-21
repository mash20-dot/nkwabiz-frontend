import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Button from "../components/Button";

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to send reset email");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <Mail className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
                        Check your email
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        We've sent a password reset link to <strong>{email}</strong>
                    </p>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        The link will expire in 15 minutes. If you don't see the email, check your spam folder.
                    </p>
                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to login
                        </Link>
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => {
                                setSuccess(false);
                                setEmail("");
                            }}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Didn't receive the email? Try again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-xl font-extrabold text-blue-600">
                    NkwaBiz
                </h2>
                <p className="mt-2 text-center text-2xl font-medium text-gray-900">
                    Reset your password
                </p>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError("");
                                    }}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                {error}
                            </div>
                        )}
                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center border-transparent shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Send reset link"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
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
    );
}

export default ForgotPassword;