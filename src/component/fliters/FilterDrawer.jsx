import React, { useState } from "react";
import FilterLayout from "./FilterLayout";
import { filterTabs } from "./filters.config";
import "./filter.drawer.css";
import filterIcon from "../../assets/filter.svg";

const FilterDrawer = ({ onApply,className = "",showText = false}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      {/* <button className="filter-trigger-btn" onClick={() => setOpen(true)}> */}
<button
  className={`filter-trigger-btn ${className}`}
  onClick={() => setOpen(true)}
>
       {showText && <span className="filter-btn-text">Filter</span>}
        <img src={filterIcon} alt="filter icon" />
        
      </button>

      {/* Drawer */}
      {open && (
        <div className="filter-overlay" onClick={() => setOpen(false)}>
          <div className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <FilterLayout
              tabs={filterTabs}
              onApply={(filters) => {
                console.log("FILTERS FROM DRAWER:", filters);
                onApply(filters);
                setOpen(false);
              }}
                onClose={() => setOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FilterDrawer;
