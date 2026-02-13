import React from "react";

const AllowancePanel = ({ filters, setFilters }) => {
  return (
    <div>
      <h3>Allowance Range</h3>
      <input
        type="number"
        value={filters.allowance.min}
        onChange={(e) => setFilters({ ...filters, allowance: { ...filters.allowance, min: +e.target.value } })}
      />
      <input
        type="number"
        value={filters.allowance.max}
        onChange={(e) => setFilters({ ...filters, allowance: { ...filters.allowance, max: +e.target.value } })}
      />
    </div>
  );
};

export default AllowancePanel;