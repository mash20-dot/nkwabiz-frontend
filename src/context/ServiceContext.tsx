import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import inventoryNavigation from "../components/Layout/InvNavData";
import smsNavigation from "../components/Layout/SMSNavData";

type ServiceType = "sms" | "inventory" | null;

type NavigationItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

type ServiceContextType = {
  activeService: ServiceType;
  setActiveService: (service: ServiceType) => void;
  navigation: NavigationItem[];
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

const STORAGE_KEY = "nkwabiz_active_service";

// Helper function to detect service from path
const detectServiceFromPath = (pathname: string): ServiceType => {
  if (pathname.startsWith("/sms")) return "sms";
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/sales") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/expenses") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/suppliers") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/admin/blog")
  ) {
    return "inventory";
  }
  return null;
};

export const ServiceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeService, setActiveServiceState] = useState<ServiceType>(() => {
    const fromPath = detectServiceFromPath(location.pathname);
    if (fromPath) return fromPath;

    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ServiceType) || null;
  });

  // Update service when route changes
  useEffect(() => {
    const serviceFromPath = detectServiceFromPath(location.pathname);

    if (serviceFromPath && serviceFromPath !== activeService) {
      setActiveServiceState(serviceFromPath);
      localStorage.setItem(STORAGE_KEY, serviceFromPath);
    } else if (!serviceFromPath && activeService === null) {
      // If on a protected route but no service detected, redirect to services
      const protectedPaths = [
        "/dashboard",
        "/products",
        "/sales",
        "/analytics",
        "/expenses",
        "/settings",
        "/notifications",
        "/suppliers",
        "/reports",
        "/admin/blog",
      ];

      const isProtectedRoute = protectedPaths.some((path) =>
        location.pathname.startsWith(path)
      );

      if (isProtectedRoute) {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setActiveServiceState(stored as ServiceType);
        } else {
          navigate("/services");
        }
      }
    }
  }, [location.pathname, activeService, navigate]);

  const setActiveService = (service: ServiceType) => {
    setActiveServiceState(service);
    if (service) {
      localStorage.setItem(STORAGE_KEY, service);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const navigation =
    activeService === "sms"
      ? smsNavigation
      : activeService === "inventory"
      ? inventoryNavigation
      : [];

  return (
    <ServiceContext.Provider
      value={{ activeService, setActiveService, navigation }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useService must be used within a ServiceProvider");
  }
  return context;
};
