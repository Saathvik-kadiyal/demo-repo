import React, { useState, useRef, useEffect } from "react";
import selectIcon from "../../../assets/select.svg";
import unselectIcon from "../../../assets/unselect.svg";
import dropdownArrow from "../../../assets/sort-drop.svg";

const currentYear = new Date().getFullYear();

const yearsList = Array.from(
  { length: currentYear - 2000 + 6 },
  (_, i) => 2000 + i
);

const monthsList = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const PeriodPanel = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
          <span className="text-gray-700 truncate">
            {years.length > 0 ? years.join(", ") : "Select years"}
          </span>

          <img
            src={dropdownArrow}
            alt="dropdown"
            className={`w-4 h-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>

        {open && (
          <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border bg-white shadow-md">
            {yearsList.map((year) => {
              const selected = years.includes(year);
              return (
                <div
                  key={year}
                  onClick={() => toggleYear(year)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50"
                >
                   <img
                    src={selected ? selectIcon : unselectIcon}
                    alt="status"
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{year}</span>
                 
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MONTHS */}
    {/* MONTHS */}
<div>
  <h3 className="font-semibold mb-2">Months</h3>

  <div className="overflow-hidden">
    {monthsList.map(({ label, value }, index) => {
      const selected = months.includes(value);
      const isLast = index === monthsList.length - 1;

      return (
        <div
          key={value}
          onClick={() => toggleMonth(value)}
          className={`
            flex items-center gap-2 cursor-pointer py-4 px-2
           border-b border-[#C6C8CA]
          `}
        >
          <img
            src={selected ? selectIcon : unselectIcon}
            alt={selected ? "selected" : "unselected"}
            className="w-4 h-4"
          />

          <span className="text-sm">{label}</span>
        </div>
      );
    })}
  </div>
</div>

    </div>
  );
};

export default PeriodPanel;
