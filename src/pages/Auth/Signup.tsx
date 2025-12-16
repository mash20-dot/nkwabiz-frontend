import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail } from "lucide-react";
import { signupUser } from "../../utils/userApi";
import Button from "../../components/Button";
import CurrencySelector from "../../components/LandingPage/CurrencySelector";
import SEO from "../../pages/LandingPage/SEO";

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    business_name: "",
    email: "",
    phone: "",
    location: "",
    password: "",
    currency: "GHS",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email" && !validateEmail(e.target.value)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
  }

  function handleCurrencyChange(currency: string) {
    setForm({ ...form, currency });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      setError("Invalid email format");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signupUser(form);
      // Show verification message instead of navigating to login
      setShowVerificationMessage(true);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // Show verification message after successful signup
  if (showVerificationMessage) {
    return (
      <>
        <SEO
          title="Verify Your Email - Nkwabiz"
          description="Check your email to verify your Nkwabiz account"
          canonical="https://www.nkwabiz.com/signup"
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
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-4">
                  We've sent a verification link to:
                </p>
                <p className="text-lg font-semibold text-blue-600 bg-blue-50 py-2 px-4 rounded-md mb-6">
                  {form.email}
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm text-gray-700 font-medium mb-2">
                    Please verify your email to activate your account
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Click the verification link in the email</li>
                    <li>The link will expire in 24 hours</li>
                    <li>Check your spam folder if you don't see it</li>
                  </ul>
                </div>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md"
                >
                  Go to Login
                </Button>

                <p className="mt-4 text-sm text-gray-500">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => navigate("/resend-verification", { state: { email: form.email } })}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Resend verification email
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show signup form
  return (
    <>
      <SEO
        title="Sign Up - Start Sending Bulk SMS in Ghana | Nkwabiz"
        description="Create your free Nkwabiz account to start sending bulk SMS to customers and manage your business in Ghana. Get started with SMS marketing today."
        canonical="https://www.nkwabiz.com/signup"
        keywords="sign up bulk sms ghana, create sms account, register bulk sms, free sms account ghana, business management signup"
        noindex={false}
      />

      <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-xl font-extrabold text-blue-600">
            NkwaBiz
          </h2>
          <p className="mt-2 text-center text-2xl font-medium text-gray-900">
            Create your account and start managing your business
          </p>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-6 md:px-0 lg:px-0">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                name="firstname"
                type="text"
                required
                placeholder="First Name"
                value={form.firstname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="lastname"
                type="text"
                required
                placeholder="Last Name"
                value={form.lastname}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="business_name"
                type="text"
                required
                placeholder="Business Name"
                value={form.business_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="phone"
                type="text"
                required
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                name="location"
                type="text"
                required
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />

              <CurrencySelector
                value={form.currency}
                onChange={handleCurrencyChange}
                label="Preferred Currency"
                required
              />

              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-blue-600"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-blue-600 border-transparent shadow-sm hover:bg-blue-700 text-white rounded-md flex justify-center focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Sign up"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
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

export default Signup;