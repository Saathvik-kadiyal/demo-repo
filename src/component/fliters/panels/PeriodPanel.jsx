import React from "react";

const yearsList = [2023, 2024, 2025, 2026];
const monthsList = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PeriodPanel = ({ filters, setFilters }) => {
  const toggle = (key, value) => {
    const arr = filters[key].includes(value)
      ? filters[key].filter(v => v !== value)
      : [...filters[key], value];

    setFilters({ ...filters, [key]: arr });
  };

  return (
    <div>
      <h3>Years</h3>
      {yearsList.map(y => (
        <label key={y}>
          <input type="checkbox" checked={filters.years.includes(y)} onChange={() => toggle("years", y)} /> {y}
        </label>
      ))}

      <h3>Months</h3>
      {monthsList.map(m => (
        <label key={m}>
          <input type="checkbox" checked={filters.months.includes(m)} onChange={() => toggle("months", m)} /> {m}
        </label>
      ))}
    </div>
  );
};

export default PeriodPanel;