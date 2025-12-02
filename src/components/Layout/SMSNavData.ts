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
  { name: "Contacts", href: "/sms/contacts", icon: Users },
  { name: "TopUp", href: "/sms/topup", icon: WalletCards },
  { name: "Settings", href: "/sms/settings", icon: Settings },
];
