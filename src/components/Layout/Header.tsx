import React from "react";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b-gray-300">
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
          <h1 className="text-base font-semibold text-gray-700">
            {/* This will be dynamically set based on the current page */}
            Dashboard
          </h1>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          {/* Notification button */}
          <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                  <span className="font-medium text-blue-800">
                    {/* Optionally show user initials or avatar */}
                    SM
                  </span>
                </div>
              </button>
            </div>
          </div>
          {/* Logout Button */}
          {/* <button
            onClick={handleLogout}
            className="ml-6 px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Logout
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
