import React, { useState } from "react";
import FilterLayout from "./FilterLayout";
import { filterTabs } from "./filters.config";
import "./filter.drawer.css";

const FilterDrawer = ({ onApply }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button className="filter-trigger-btn" onClick={() => setOpen(true)}>
        Filters
      </button>

      {/* Drawer */}
      {open && (
        <div className="filter-overlay" onClick={() => setOpen(false)}>
          <div
            className="filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterLayout
              tabs={filterTabs}
              onApply={(filters) => {
                onApply(filters);
                setOpen(false);
              }}
              onReset={() => {}}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterDrawer;
