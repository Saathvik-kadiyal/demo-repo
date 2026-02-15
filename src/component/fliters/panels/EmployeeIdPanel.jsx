import React from "react";

const EmployeeIdPanel = ({ filters, setFilters }) => {
  return (
    <div className="flex justify-center">
      <input
        value={filters.employeeId}
        onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
        placeholder="Enter Employee ID"
        className="w-[96%] rounded-md border border-[#DDDDDD] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default EmployeeIdPanel;