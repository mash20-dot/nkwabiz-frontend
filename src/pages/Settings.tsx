import React, { useState, useEffect } from "react";
import { Lock, Eye, EyeOff, DollarSign } from "lucide-react";
import { apiFetch } from "../utils/api";
import { useAuthStore } from "../store/useAuthStore";
import CurrencySelector from "../components/LandingPage/CurrencySelector";
import { getCurrencyInfo } from "../utils/currencyUtils";

const Settings = () => {
  const currency = useAuthStore((state) => state.currency);
  const setCurrency = useAuthStore((state) => state.setCurrency);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Currency state
  const [selectedCurrency, setSelectedCurrency] = useState(currency || "GHS");
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [currencyError, setCurrencyError] = useState("");
  const [currencySuccess, setCurrencySuccess] = useState("");

  useEffect(() => {
    setSelectedCurrency(currency || "GHS");
  }, [currency]);

  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword) {
      setError("Both fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch(
        "/password/update-password",
        {
          method: "POST",
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword
          })
        },
        true
      );

      setSuccess(data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess("");
      }, 2000);
    } catch (err: any) {
      setError(err.message || err.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyUpdate = async () => {
    setCurrencyError("");
    setCurrencySuccess("");
    setCurrencyLoading(true);

    try {
      const data = await apiFetch(
        "/user/update-currency",
        {
          method: "PUT",
          body: JSON.stringify({ currency: selectedCurrency })
        },
        true
      );

      setCurrency(selectedCurrency);
      setCurrencySuccess("Currency updated successfully! Refresh to see changes.");

      // Optionally reload after 2 seconds to update all prices
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setCurrencyError(err.message || "Failed to update currency");
    } finally {
      setCurrencyLoading(false);
    }
  };

  const currencyInfo = getCurrencyInfo();

  return (
    <div className="flex flex-col items-start justify-center gap-6">
      <div className="w-full flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-medium text-gray-900">Settings</h1>
      </div>

      {/* Currency Settings Card */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Currency Preferences
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Choose your preferred currency for all prices and transactions.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{currencyInfo.flag}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Current: {currencyInfo.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    Symbol: {currencyInfo.symbol} • Code: {currencyInfo.code}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <CurrencySelector
                value={selectedCurrency}
                onChange={setSelectedCurrency}
                label="Select Currency"
              />
            </div>

            {currencyError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {currencyError}
              </div>
            )}

            {currencySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                {currencySuccess}
              </div>
            )}

            <div>
              <button
                onClick={handleCurrencyUpdate}
                disabled={currencyLoading || selectedCurrency === currency}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currencyLoading ? "Updating..." : "Update Currency"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Settings Card */}
      <div className="w-full bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Password
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your password to keep your account secure.
              </p>
            </div>

            <div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Update Password
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword("");
                    setNewPassword("");
                    setError("");
                    setSuccess("");
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      id="old-password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                      placeholder="Enter your old password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-10"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Must be at least 8 characters
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setOldPassword("");
                    setNewPassword("");
                    setError("");
                    setSuccess("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;