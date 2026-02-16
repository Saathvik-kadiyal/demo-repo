import React, { useState } from "react";
import LeftTabs from "./LeftTabs";
import RightPanels from "./RightPanels";
import "./filter.styles.css";

const initialState = {
  client: [],
  years: [],
  months: [],
  employeeId: "",
//   allowance: "",      // single string: "100-200"
  departments: [],
  headcounts: ""      // single string: "1-5" or "Highest to Lowest"
};

const FilterLayout = ({ tabs, onApply, onReset }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [filters, setFilters] = useState(initialState);

  return (
    <div className="filter-layout">
      <div className="filter-header">Filters</div>

      <div className="filter-body">
        <LeftTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <RightPanels
          tabs={tabs}
          activeTab={activeTab}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="filter-footer">
        <button
          onClick={() => {
            setFilters(initialState);
            onReset?.();
          }}
        >
          Reset
        </button>

        <button
          onClick={() => {
            const cleanedFilters = {};

            Object.entries(filters).forEach(([key, value]) => {
              // Arrays: client, years, months, departments
              if (Array.isArray(value) && value.length > 0) {
                cleanedFilters[key] = value;
              }
              // Strings: allowance, headcounts, employeeId
              else if (typeof value === "string" && value.trim() !== "") {
                cleanedFilters[key] = value;
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
