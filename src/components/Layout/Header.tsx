import React, { useState, useEffect } from "react";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";
import { apiFetch } from "../../utils/api";
import ProfileCard from "../ProfileCard";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileActive, setIsProfileActive] = useState<boolean>(false);
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [userInitials, setUserInitials] = useState<string>("SM");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user info
    apiFetch("/security/user-info", {}, true)
      .then((data) => {
        if (data.firstname) {
          setUserFirstName(data.firstname);
          // Get initials from first name and last name
          const initials = data.firstname.charAt(0) + (data.lastname?.charAt(0) || "");
          setUserInitials(initials.toUpperCase());
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user info:", err);
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
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-b-gray-300">
      <ProfileCard
        onClick={handleLogout}
        isActive={isProfileActive}
      />
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <h1 className="text-base font-medium text-gray-700">
            Dashboard
          </h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification button */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* User greeting - Hidden on small screens, shown on medium+ */}
          {userFirstName && (
            <div className="hidden md:flex items-center ml-4 mr-2">
              <span className="text-sm text-gray-700">
                Hi, <span className="font-semibold">{userFirstName}</span>
              </span>
            </div>
          )}

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                onClick={handleProfileClick}
                className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="font-medium text-blue-800 text-xs">
                    {userInitials}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;