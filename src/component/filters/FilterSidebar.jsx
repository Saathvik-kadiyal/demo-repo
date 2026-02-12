import { useState } from "react";
import FilterGroup from "./FilterGroup";

export default function FilterSidebar({
  filters = [],
  onApply,
  isOpen,
  onClose
}) {
  const [selected, setSelected] = useState({});
  const [activeFilter, setActiveFilter] = useState(filters[0]?.id);

  const updateFilter = (id, value) => {
    setSelected(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 transition-opacity z-40
        ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* SIDEBAR */}
      <div
        className={`fixed right-0 top-0 h-screen w-[420px] bg-white shadow-2xl border-l flex flex-col z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Filters</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT MENU */}
          <div className="w-[160px] border-r bg-gray-50 overflow-y-auto">
            {filters.map(f => (
              <div
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-4 py-3 cursor-pointer text-sm font-medium transition
                ${
                  activeFilter === f.id
                    ? "bg-blue-100 text-blue-700"
                    : "hover:bg-blue-50"
                }
                `}
              >
                {f.label}
              </div>
            ))}
          </div>

          {/* RIGHT PANEL */}
          <div className="flex-1 overflow-y-auto p-5">
            {filters
              .filter(f => f.id === activeFilter)
              .map(filter => (
                <FilterGroup
                  key={filter.id}
                  filter={filter}
                  value={selected[filter.id]}
                  onChange={(val) => updateFilter(filter.id, val)}
                />
              ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-white">
          <button
            onClick={() => onApply?.(selected)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}
