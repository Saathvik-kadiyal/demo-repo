import React, { useState } from "react";
import LeftTabs from "./LeftTabs";
import RightPanels from "./RightPanels";
import "./filter.styles.css"

const initialState = {
  client: [],
  years: [],
  months: [],
  employeeId: "",
  allowance: { min: 1, max: 100 },
  departments: [],
  headcounts: { min: 1, max: 5 }
};

const FilterLayout = ({ tabs, onApply, onReset }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [filters, setFilters] = useState(initialState);
  console.log(filters)

  return (
    <div className="filter-layout">
      <div className="filter-header">Filters</div>

      <div className="filter-body">
        <LeftTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        <RightPanels
          tabs={tabs}
          activeTab={activeTab}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="filter-footer">
        <button onClick={() => { setFilters(initialState); onReset?.(); }}>Reset</button>
        <button
  onClick={() => {
    const cleanedFilters = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        cleanedFilters[key] = value;
      } else if (typeof value === "string" && value.trim() !== "") {
        cleanedFilters[key] = value;
      } else if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        // For range objects like allowance, headcounts
        const hasMin = value.min !== undefined && value.min !== null;
        const hasMax = value.max !== undefined && value.max !== null;

        if (hasMin || hasMax) {
          cleanedFilters[key] = value;
        }
      }
    });

    onApply(cleanedFilters);
  }}
>
  Apply
</button>

      </div>
    </div>
  );
};

export default FilterLayout;