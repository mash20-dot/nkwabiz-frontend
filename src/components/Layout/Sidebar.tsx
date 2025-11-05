import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart2,
  WalletCards,
  Settings,
  X,
} from "lucide-react";
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/products",
      icon: Package,
    },
    {
      name: "Sales",
      href: "/sales",
      icon: ShoppingCart,
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: WalletCards,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: BarChart2,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
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
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    location.pathname === item.href
                      ? "bg-blue-900 text-white"
                      : "text-blue-100 hover:bg-blue-700"
                  }`}
                >
                  <item.icon
                    className="mr-4 h-6 w-6 text-blue-200"
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
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-800">
              <Link to="/" className="text-2xl font-bold text-white">
                NkwaBiz
              </Link>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto bg-blue-800">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href
                        ? "bg-blue-900 text-white"
                        : "text-blue-100 hover:bg-blue-700"
                    }`}
                  >
                    <item.icon
                      className="mr-3 h-6 w-6 text-blue-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
