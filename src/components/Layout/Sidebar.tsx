import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LucideIcon, FileText, X, ChevronDown, ChevronRight, Receipt } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { apiFetch } from "../../utils/api";
import ProfileCard from "../ProfileCard";
import Tab from "../Tab";

import { MessagesSquare, Store } from "lucide-react";

type NavigationProps = {
  name: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationProps[];
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
  const [isServicesCardOpen, setIsServicesCardOpen] = useState<boolean>(false);
  const [reportsOpen, setReportsOpen] = useState<boolean>(false);
  const businessName = useAuthStore((state) => state.businessName);
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  // Auto-open Reports dropdown if on payment history page
  useEffect(() => {
    if (location.pathname === "/sms/payment-history") {
      setReportsOpen(true);
    }
  }, [location.pathname]);

  async function checkAdminStatus() {
    try {
      const userData = await apiFetch("/security/user-info", {}, true);
      setIsAdmin(userData.role === "admin");
    } catch (err) {
      console.error("Failed to check admin status:", err);
      setIsAdmin(false);
    }
  }

  // Reports dropdown item
  const reportsNavItem: NavigationProps = {
    name: "Reports",
    href: "#",
    icon: FileText,
    children: [
      {
        name: "Payment History",
        href: "/sms/payment-history",
        icon: Receipt,
      },
    ],
  };

  // Add Reports and Blog Admin to navigation
  const allNavigation: NavigationProps[] = [
    ...navigation,
    reportsNavItem,
    ...(isAdmin
      ? [
        {
          name: "Blog Admin",
          href: "/admin/blog",
          icon: FileText,
        },
      ]
      : []),
  ];

  const NavItem = ({ item, isMobile = false }: { item: NavigationProps; isMobile?: boolean }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isActive = location.pathname === item.href ||
      (item.href === "/admin/blog" && location.pathname.startsWith("/admin/blog"));

    const isReportsItem = item.name === "Reports";
    const isOpen = isReportsItem ? reportsOpen : false;

    if (hasChildren) {
      return (
        <div>
          {/* Parent Item */}
          <button
            onClick={() => {
              if (isReportsItem) {
                setReportsOpen(!reportsOpen);
              }
            }}
            className={`w-full group flex items-center justify-between px-2 py-2 ${isMobile ? "text-base" : "text-sm"
              } font-medium rounded-md ${isActive
                ? "bg-blue-900 text-white"
                : "text-blue-100 hover:bg-blue-700"
              }`}
          >
            <div className="flex items-center gap-2">
              <item.icon
                className="h-4 w-4 text-blue-200"
                aria-hidden="true"
              />
              {item.name}
              {isReportsItem && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-500 text-white">
                  NEW
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-blue-200" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-200" />
            )}
          </button>

          {/* Children Items */}
          {isOpen && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children?.map((child) => (
                <Link
                  key={child.name}
                  to={child.href}
                  className={`group flex items-center px-2 py-2 ${isMobile ? "text-base" : "text-sm"
                    } font-medium rounded-md ${location.pathname === child.href
                      ? "bg-blue-900 text-white"
                      : "text-blue-100 hover:bg-blue-700"
                    }`}
                  onClick={() => {
                    if (isMobile) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <child.icon
                    className="mr-2 h-4 w-4 text-blue-200"
                    aria-hidden="true"
                  />
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Regular item without children
    return (
      <Link
        to={item.href}
        className={`group flex items-center px-2 py-2 ${isMobile ? "text-base" : "text-sm"
          } font-medium rounded-md ${isActive
            ? "bg-blue-900 text-white"
            : "text-blue-100 hover:bg-blue-700"
          }`}
        onClick={() => {
          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
      >
        <item.icon
          className="mr-2 h-4 w-4 text-blue-200"
          aria-hidden="true"
        />
        {item.name}
      </Link>
    );
  };

  return (
    <>
      {/* Services Card */}
      <ProfileCard
        isActive={isServicesCardOpen}
        className="bottom-20 md:bottom-16 left-4 z-100"
        title="Services"
      >
        <a href="/dashboard" className="w-full">
          <Tab tabName="Inventory" icon={Store} />
        </a>

        <a href="/sms/dashboard">
          <Tab tabName="Bulk SMS" icon={MessagesSquare} />
        </a>
      </ProfileCard>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? "visible" : "invisible"
          }`}
        aria-hidden="true"
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-gray-600 ${sidebarOpen
              ? "opacity-75 transition-opacity ease-linear duration-300"
              : "opacity-0 transition-opacity ease-linear duration-300"
            }`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Sidebar */}
        <div
          className={`relative flex-1 flex flex-col max-w-60 pt-5 pb-4 bg-blue-800 transition ease-in-out duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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

          {/* Logo */}
          <div className="shrink-0 flex items-center px-4">
            <Link to="/" className="text-2xl font-bold text-white">
              NkwaBiz
            </Link>
          </div>

          {/* Menu Items */}
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {allNavigation.map((item) => (
                <NavItem key={item.name} item={item} isMobile={true} />
              ))}
            </nav>
          </div>

          {/* Business Information */}
          <button
            className="flex cursor-pointer items-center shrink-0 px-4 pb-2 h-16 bg-blue-800"
            onClick={() => setIsServicesCardOpen((prev) => !prev)}
          >
            <div className="h-8 w-8 rounded-sm bg-blue-200 text-blue-800 flex items-center font-medium justify-center">
              {businessName?.slice(0, 2).toUpperCase()}
            </div>
            <span className="ml-2 font-medium text-white">
              {businessName || "Business Name"}
            </span>
          </button>
        </div>
        <div className="shrink-0 w-14" aria-hidden="true">
          {/* Dummy element to force sidebar to shrink to fit close icon */}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:shrink-0 w-60">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            {/* Logo */}
            <div className="flex items-center h-16 shrink-0 px-4 bg-blue-800">
              <Link to="/" className="text-2xl font-bold text-white">
                NkwaBiz
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-blue-800">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {allNavigation.map((item) => (
                  <NavItem key={item.name} item={item} isMobile={false} />
                ))}
              </nav>
            </div>

            {/* Business Name */}
            <button
              className="flex cursor-pointer items-center shrink-0 px-4 pb-2 h-16 bg-blue-800 hover:bg-blue-900"
              onClick={() => setIsServicesCardOpen((prev) => !prev)}
            >
              <div className="h-8 w-8 rounded-sm bg-blue-200 text-blue-800 flex items-center font-medium justify-center">
                {businessName?.slice(0, 2).toUpperCase()}
              </div>
              <span className="ml-2 font-medium text-white">
                {businessName || "Business Name"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Sidebar;