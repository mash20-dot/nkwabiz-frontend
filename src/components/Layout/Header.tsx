import React, { useState, useEffect } from "react";
import { Menu, Bell, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../utils/auth";
import { apiFetch } from "../../utils/api";
import ProfileCard from "../ProfileCard";
import { useSms } from "@/context/BulkSmsContext";

import Tab from "../Tab";
import { Settings, LogOut } from "lucide-react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();

  const { smsData } = useSms();

  // Check if we're on BulkSMS related pages
  const isBulkSmsPage =
    location.pathname.startsWith("/sms") ||
    location.pathname.includes("bulk-sms");

  useEffect(() => {
    // Fetch user info
    setLoading(true);
    console.log("Environment:", window.location.hostname); // Debug: check environment
    console.log("Fetching from /security/user-info"); // Debug log

    apiFetch("/security/user-info", {}, true)
      .then((data) => {
        console.log("User info response:", data); // Debug log
        console.log("Response keys:", Object.keys(data)); // Debug: see all available keys

        // Try different possible field names
        const firstName =
          data.firstname || data.firstName || data.first_name || data.name;

        if (firstName) {
          setUserFirstName(firstName);
          console.log("First name set to:", firstName); // Debug log
        } else {
          console.warn(
            "No firstname found in response. Full data:",
            JSON.stringify(data)
          );
          setError("Name not found in response");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
        console.error("Error details:", JSON.stringify(err)); // More detailed error
        setError(err.message || "Failed to fetch user info");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleProfileClick() {
    setIsProfileActive(!isProfileActive);
  }

  return (
    <header className="sticky top-0 z-10 shrink-0 flex h-16 bg-white border-b border-b-gray-300">
      <ProfileCard isActive={isProfileActive} className="right-4 top-16">
        <a href="/settings" className="w-full">
          <Tab tabName="Account Settings" icon={Settings} />
        </a>

        <Tab tabName="Sign out" icon={LogOut} onClick={handleLogout} />
      </ProfileCard>
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <h1 className="text-base font-medium text-gray-700">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2 md:space-x-3 gap-1">
          {/* SMS Balance - Only show on BulkSMS pages */}
          {isBulkSmsPage && smsData && (
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-blue-600 font-medium">
                SMS Balance:
              </span>
              <span className="text-sm font-semibold text-blue-700">
                {smsData.total_sms?.toLocaleString() || 0}
              </span>
            </div>
          )}

          {/* User greeting - Shows on all screens */}
          {loading ? (
            <div className="flex items-center mr-1">
              <span className="text-sm text-gray-400">Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center mr-1">
              <span className="text-sm text-red-500">{error}</span>
            </div>
          ) : userFirstName ? (
            <div className="flex items-center mr-1">
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Hi, <span className="font-semibold">{userFirstName}</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center mr-1">
              <span className="text-sm text-gray-400">No name</span>
            </div>
          )}

          {/* Notification button */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
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
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isProfileActive ? "rotate-180" : ""
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
