import { X, Search } from "lucide-react";

export default function SearchInput({
  value = "",
  onChange,
  onKeyDown,
  placeholder = "Search...",
  className = "",
}) {
  return (
    <div className={`relative max-w-xs ${className}`}>
      
      {/* Search Icon */}

    <input
  type="text"
  value={value}
  onChange={(e) => onChange(e.target.value)}
   onKeyDown={onKeyDown}
  placeholder={placeholder}
  className="
    w-[212px]
    rounded-sm
    border border-gray-200
    bg-white
    px-3 py-2
    text-sm text-gray-700
    text-left
    transition-all duration-200
    focus:bg-white
    focus:border-[#15549D]
    focus:ring-2 focus:ring-[#15549D]/20
    outline-none
  "
/>

<Search
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      {/* Clear Button
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400
            hover:text-gray-700
            transition
          "
        >
          <X size={16} />
        </button>
      )} */}
    </div>
  );
}
