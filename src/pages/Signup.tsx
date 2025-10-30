import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { signupUser } from "../utils/userApi";

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email" && !validateEmail(e.target.value)) {
      setError("Invalid email format");
    } else {
      setError("");
    }
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
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="lastname"
              type="text"
              required
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="business_name"
              type="text"
              required
              placeholder="Business Name"
              value={form.business_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="phone"
              type="text"
              required
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="location"
              type="text"
              required
              placeholder="Location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Sign up"}
            </button>
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
