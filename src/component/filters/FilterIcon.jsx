import { useState } from "react";
import FilterSidebar from "./FilterSidebar";
import { SlidersHorizontal } from "lucide-react";

export default function FilterIcon({ filters, onApply }) {

  const [openFilters, setOpenFilters] = useState(false);

  return (
    <div>

      {/* FILTER BUTTON */}
      <button
        onClick={() => setOpenFilters(true)}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
      >
        <SlidersHorizontal size={18} />
        Filters
      </button>

      {/* SIDEBAR */}
      <FilterSidebar
        isOpen={openFilters}
        onClose={() => setOpenFilters(false)}
        filters={filters}
        onApply={(data) => {
          onApply?.(data); // safe call
          setOpenFilters(false);
        }}
      />

    </div>
  );
}
