import { useAuthStore } from "../store/useAuthStore";

// Currency configuration
export const CURRENCIES = {
    GHS: { code: "GHS", symbol: "₵", name: "Ghana Cedi", flag: "🇬🇭" },
    NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬" },
    USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    GBP: { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦" },
    KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪" },
    XOF: { code: "XOF", symbol: "CFA", name: "West African CFA", flag: "🌍" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

/**
 * Format amount with user's preferred currency
 * @param amount - The numeric amount to format
 * @param currency - Optional currency override (defaults to user's preference)
 * @returns Formatted string like "₵1,234.56"
 */
export function formatCurrency(amount: number, currency?: CurrencyCode): string {
    const userCurrency = currency || (useAuthStore.getState().currency as CurrencyCode) || "GHS";
    const currencyInfo = CURRENCIES[userCurrency] || CURRENCIES.GHS;

    // Format with 2 decimal places and thousands separator
    const formatted = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return `${currencyInfo.symbol}${formatted}`;
}

/**
 * Get currency symbol for user's preferred currency
 */
export function getCurrencySymbol(): string {
    const userCurrency = (useAuthStore.getState().currency as CurrencyCode) || "GHS";
    return CURRENCIES[userCurrency]?.symbol || "₵";
}

/**
 * Get full currency info
 */
export function getCurrencyInfo(): typeof CURRENCIES[CurrencyCode] {
    const userCurrency = (useAuthStore.getState().currency as CurrencyCode) || "GHS";
    return CURRENCIES[userCurrency] || CURRENCIES.GHS;
}

/**
 * Get all available currencies as array for dropdown
 */
export function getAllCurrencies() {
    return Object.values(CURRENCIES);
}