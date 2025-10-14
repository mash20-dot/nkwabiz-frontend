import {
  ShoppingCart,
  Sandwich,
  PillBottle,
  SoapDispenserDroplet,
  WashingMachine,
  Package2,
  HelpCircle
} from "lucide-react";

export const CATEGORY_LIST = [
  { label: "Groceries", value: "groceries", icon: ShoppingCart },
  { label: "Bakery", value: "bakery", icon:  Sandwich },
  { label: "Canned Goods", value: "canned_goods", icon: PillBottle },
  { label: "Household", value: "household", icon: SoapDispenserDroplet },
  { label: "Personal Care", value: "personal_care", icon: WashingMachine },
  { label: "Other", value: "other", icon: Package2 }
];

// Utility to auto-suggest category from product name
export function getAutoCategory(product_name: string) {
  const lower = product_name.toLowerCase();
  if (lower.match(/rice|oil|sugar|milk/)) return CATEGORY_LIST[0]; // Groceries
  if (lower.match(/bread/)) return CATEGORY_LIST[1]; // Bakery
  if (lower.match(/paste|can/)) return CATEGORY_LIST[2]; // Canned Goods
  if (lower.match(/soap|detergent/)) return CATEGORY_LIST[3]; // Household
  if (lower.match(/toothpaste|tooth/)) return CATEGORY_LIST[4]; // Personal Care
  return CATEGORY_LIST[5]; // Other
}