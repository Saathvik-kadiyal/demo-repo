import React, { useState } from "react";
import LeftTabs from "./LeftTabs";
import RightPanels from "./RightPanels";
import "./filter.styles.css";

const FilterLayout = ({ tabs, onApply, onReset }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const [filters, setFilters] = useState({}); // 🔑 empty by default

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
            setFilters({});
            onReset?.();
          }}
        >
          Reset
        </button>

        <button
          onClick={() => {
            // filters already contains ONLY selected values
            onApply(filters);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterLayout;
