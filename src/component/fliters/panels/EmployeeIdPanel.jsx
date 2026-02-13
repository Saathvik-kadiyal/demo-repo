import React from "react";

const EmployeeIdPanel = ({ filters, setFilters }) => {
  return (
    <div>
      <h3>Employee ID</h3>
      <input
        value={filters.employeeId}
        onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
        placeholder="Enter Employee ID"
      />
    </div>
  );
};

export default EmployeeIdPanel;