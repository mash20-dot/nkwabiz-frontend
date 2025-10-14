import React from "react";
import { Search } from "lucide-react";

export default function ProductSearchBar({
  value,
  onChange,
  onSearch,
  loading
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <form className="relative flex" onSubmit={onSearch}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search products..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button type="submit" className="ml-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}