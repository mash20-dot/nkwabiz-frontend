import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon, FileText, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiFetch } from "../../utils/api";

type NavigationProps = {
  name: string;
  href: string;
  icon: LucideIcon;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  navigation: NavigationProps[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  navigation,
}) => {
  const businessName = useAuthStore((state) => state.businessName);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      const userData = await apiFetch("/security/user-info", {}, true);
      setIsAdmin(userData.role === "admin");
    } catch (err) {
      console.error("Failed to check admin status:", err);
      setIsAdmin(false);
    }
  }

  // Add Blog Admin link only if user is admin
  const allNavigation: NavigationProps[] = isAdmin
    ? [
        ...navigation,
        {
          name: "Blog Admin",
          href: "/admin/blog",
          icon: FileText,
        },
      ]
    : navigation;

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${
          sidebarOpen ? "visible" : "invisible"
        }`}
        aria-hidden="true"
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-600 ${
            sidebarOpen
              ? "opacity-75 transition-opacity ease-linear duration-300"
              : "opacity-0 transition-opacity ease-linear duration-300"
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-[240px] pt-5 pb-4 bg-blue-800 transition ease-in-out duration-300 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <X className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <div className="flex-shrink-0 flex items-center px-4">
            <Link to="/" className="text-2xl font-bold text-white">
              NkwaBiz
            </Link>
          </div>
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {allNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href ||
                    (item.href === "/admin/blog" &&
                      location.pathname.startsWith("/admin/blog"))
                      ? "bg-blue-900 text-white"
                      : "text-blue-100 hover:bg-blue-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className="mr-2 h-4 w-4 text-blue-200"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex-shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0 w-60">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-800">
              <Link to="/" className="text-2xl font-bold text-white">
                NkwaBiz
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-blue-800">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {allNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href ||
                      (item.href === "/admin/blog" &&
                        location.pathname.startsWith("/admin/blog"))
                        ? "bg-blue-900 text-white"
                        : "text-blue-100 hover:bg-blue-700"
                    }`}
                  >
                    <item.icon
                      className="mr-2 h-4 w-4 text-blue-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Business Name */}
            <div className="flex items-center flex-shrink-0 px-4 pb-2 h-16 bg-blue-800">
              <div className="h-8 w-8 rounded-sm bg-blue-200 text-blue-800 flex items-center font-medium justify-center">
                {businessName?.slice(0, 2).toUpperCase()}
              </div>
              <span className="ml-2 font-medium text-white">
                {businessName || "Business Name"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
