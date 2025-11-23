import React from "react";
import { CURRENCIES, CurrencyCode } from "../../utils/currencyUtils";
interface CurrencySelectorProps {
    value: string;
    onChange: (currency: string) => void;
    label?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function CurrencySelector({
    value,
    onChange,
    label = "Currency",
    required = false,
    disabled = false,
}: CurrencySelectorProps) {
    const currencies = Object.values(CURRENCIES);

    return (
        <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id="currency"
                name="currency"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.name} ({curr.symbol})
                    </option>
                ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
                This will be used for all prices in your account
            </p>
        </div>
    );
}