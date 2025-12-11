import React, { useState, useEffect } from "react";
import { Menu, Bell, User, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../utils/auth";
import { apiFetch } from "../../utils/api";
import ProfileCard from "../ProfileCard";

import Tab from "../Tab";
import { Settings, LogOut } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  const [isSmsBalanceOpen, setIsSmsBalanceOpen] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [smsBalance, setSmsBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on BulkSMS related pages
  const isBulkSmsPage =
    location.pathname.startsWith("/sms") ||
    location.pathname.includes("bulk-sms");

  useEffect(() => {
    // Fetch user info
    setLoading(true);
    console.log("Environment:", window.location.hostname);
    console.log("Fetching from /security/user-info");

    apiFetch("/security/user-info", {}, true)
      .then((data) => {
        console.log("User info response:", data);
        console.log("Response keys:", Object.keys(data));

        // Try different possible field names for first name
        const firstName =
          data.firstname || data.firstName || data.first_name || data.name;

        if (firstName) {
          setUserFirstName(firstName);
          console.log("First name set to:", firstName);
        } else {
          console.warn(
            "No firstname found in response. Full data:",
            JSON.stringify(data)
          );
          setError("Name not found in response");
        }

        // Get SMS balance
        if (data.sms_balance !== undefined) {
          setSmsBalance(data.sms_balance);
          console.log("SMS balance set to:", data.sms_balance);
        } else {
          console.warn("No sms_balance found in response");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        console.error("Error details:", JSON.stringify(err));
        setError(err.message || "Failed to fetch user info");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.sms-balance-dropdown') && !target.closest('.profile-dropdown')) {
        setIsSmsBalanceOpen(false);
        setIsProfileActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleProfileClick() {
    setIsProfileActive(!isProfileActive);
    setIsSmsBalanceOpen(false); // Close SMS dropdown when opening profile
  }

  function toggleSmsBalance() {
    setIsSmsBalanceOpen(!isSmsBalanceOpen);
    setIsProfileActive(false); // Close profile dropdown when opening SMS
  }

  return (
    <header className="sticky top-0 z-10 shrink-0 flex h-16 bg-white border-b border-b-gray-300">
      <ProfileCard isActive={isProfileActive} className="right-4 top-16">
        <a href="/settings" className="w-full">
          <Tab tabName="Account Settings" icon={Settings} />
        </a>

        <Tab tabName="Sign out" icon={LogOut} onClick={handleLogout} />
      </ProfileCard>

      {/* Mobile menu button */}
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex-1 px-3 md:px-4 flex justify-between items-center">
        {/* Dashboard title - Hidden on mobile */}
        <div className="hidden md:flex flex-1 items-center">
          <h1 className="text-base font-medium text-gray-700">Dashboard</h1>
        </div>

        {/* Right side icons and info */}
        <div className="flex items-center gap-2 ml-auto">
          {/* SMS Balance - Desktop: Always visible, Mobile: Dropdown */}
          {isBulkSmsPage && (
            <div className="relative sms-balance-dropdown">
              {/* Desktop view - always visible */}
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm text-blue-600 font-medium">
                  SMS Balance:
                </span>
                <span className="text-sm font-semibold text-blue-700">
                  {smsBalance?.toLocaleString() || 0}
                </span>
              </div>

              {/* Mobile view - dropdown button */}
              <button
                onClick={toggleSmsBalance}
                className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span className="text-xs text-blue-600 font-medium">SMS</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-blue-600 transition-transform ${isSmsBalanceOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Mobile dropdown content */}
              {isSmsBalanceOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 px-3 z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600 font-medium">
                      SMS Balance:
                    </span>
                    <span className="text-sm font-semibold text-blue-700">
                      {smsBalance?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User greeting - Hidden on small mobile, visible on larger screens */}
          {loading ? (
            <div className="hidden xs:flex items-center">
              <span className="text-xs sm:text-sm text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="hidden xs:flex items-center">
              <span className="text-xs sm:text-sm text-red-500">Error</span>
            </div>
          ) : userFirstName ? (
            <div className="hidden xs:flex items-center">
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                Hi, <span className="font-semibold">{userFirstName}</span>
              </span>
            </div>
          ) : null}

          {/* Notification button */}
          <button className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative profile-dropdown">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-1 max-w-xs bg-white text-sm rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors p-1"
              aria-expanded={isProfileActive}
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600" />
              </div>
              {/* Dropdown arrow indicator */}
              <svg
                className={`h-4 w-4 text-gray-400 transition-transform ${isProfileActive ? "rotate-180" : ""
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;