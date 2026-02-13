import React from "react";

const HeadCountsPanel = ({ filters, setFilters }) => {
  return (
    <div>
      <h3>Headcounts</h3>
      <input
        type="number"
        value={filters.headcounts.min}
        onChange={(e) => setFilters({ ...filters, headcounts: { ...filters.headcounts, min: +e.target.value } })}
      />
      <input
        type="number"
        value={filters.headcounts.max}
        onChange={(e) => setFilters({ ...filters, headcounts: { ...filters.headcounts, max: +e.target.value } })}
    />
    </div>
  );
};

export default HeadCountsPanel;