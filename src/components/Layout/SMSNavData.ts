import {
  Home,
  MessageSquare,
  Users,
  WalletCards,
  Settings,
} from "lucide-react";

export default [
  { name: "Dashboard", href: "/sms/dashboard", icon: Home },
  { name: "Bulk SMS", href: "/sms/bulksms", icon: MessageSquare },
  { name: "Customers", href: "/sms/customers", icon: Users },
  { name: "Wallet", href: "/sms/wallet", icon: WalletCards },
  { name: "Settings", href: "/sms/settings", icon: Settings },
];
