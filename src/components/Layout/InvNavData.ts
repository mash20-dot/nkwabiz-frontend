import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  WalletCards,
  BarChart2,
  Settings,
} from "lucide-react";

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

export default navigation;
