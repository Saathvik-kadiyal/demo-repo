import React, { useState, useRef, useEffect } from "react";

const currentYear = new Date().getFullYear();

const yearsList = Array.from(
  { length: currentYear - 2000 + 6 },
  (_, i) => 2000 + i
);

const monthsList = [
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" }
];

const PeriodPanel = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ✅ Safe fallbacks
  const years = filters.years ?? [];
  const months = filters.months ?? [];

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleYear = (year) => {
    const next = years.includes(year)
      ? years.filter((y) => y !== year)
      : [...years, year];

    setFilters((prev) => {
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy.years;
        return copy;
      }
      return { ...prev, years: next };
    });
  };

  const toggleMonth = (value) => {
    const next = months.includes(value)
      ? months.filter((m) => m !== value)
      : [...months, value];

    setFilters((prev) => {
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy.months;
        return copy;
      }
      return { ...prev, months: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* YEARS */}
      <div ref={dropdownRef} className="relative">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Years</h3>

        <div
          onClick={() => setOpen(!open)}
          className="
            flex items-center justify-between
            w-full px-3 py-2 text-sm
            border border-gray-300 rounded-lg
            bg-white cursor-pointer
          "
        >
          <span className="text-gray-700">
            {years.length > 0 ? years.join(", ") : "Select years"}
          </span>
          <span className="text-gray-400">▾</span>
        </div>

        {open && (
          <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border bg-white shadow-md">
            {yearsList.map((year) => {
              const checked = years.includes(year);
              return (
                <div
                  key={year}
                  onClick={() => toggleYear(year)}
                  className={`
                    flex items-center justify-between
                    px-3 py-2 cursor-pointer text-sm
                    ${checked ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"}
                  `}
                >
                  <span>{year}</span>
                  {checked && <span>✓</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MONTHS */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Months</h3>
        <div className="divide-y rounded-lg border">
          {monthsList.map(({ label, value }) => {
            const checked = months.includes(value);
            return (
              <label
                key={value}
                className={`
                  flex items-center justify-between
                  px-3 py-2 cursor-pointer
                  ${checked ? "bg-blue-50" : "hover:bg-gray-50"}
                `}
              >
                <span className="text-sm">{label}</span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleMonth(value)}
                />
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PeriodPanel;
