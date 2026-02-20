import React, { useState } from "react";
import LeftTabs from "./LeftTabs";
import RightPanels from "./RightPanels";
import "./filter.styles.css";
import close from "../../assets/close.svg";

const initialState = {
  client: [],
  years: [],
  months: [],
  employeeId: "",
//   allowance: "",      // single string: "100-200"
  departments: [],
  headcounts: ""      // single string: "1-5" or "Highest to Lowest"
};

const FilterLayout = ({ tabs, onApply, onReset,onClose }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [filters, setFilters] = useState(initialState);

  return (
    <div className="filter-layout">
      {/* <div className="filter-header">Filters</div> */}
      <div className="filter-header">
  <span>Filters</span>
  <img
    src={close}
    alt="Close"
    className="close-icon"
    onClick={onClose}
  />
</div>

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

      {/* <div className="filter-footer">
        <button
          onClick={() => {
            setFilters(initialState);
            onReset?.();
          }}
        >
          Reset
        </button> */}

<div className="filter-footer">
  {/* Reset Button */}
  <button
    onClick={() => {
      setFilters(initialState);
      onReset?.();
      onClose?.(); // closes drawer
    }}
    className="reset-btn"
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
          className="apply-btn"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterLayout;
