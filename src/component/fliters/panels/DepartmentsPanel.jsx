import React, { useEffect, useState } from "react";

const DepartmentsPanel = ({ filters, setFilters }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/client-departments");
        const data = await res.json();
        setDepartments(data || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const toggle = (dept) => {
    const arr = filters.departments.includes(dept)
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept];

    setFilters({ ...filters, departments: arr });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Departments</h3>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {departments.map((dept) => {
        const selected = filters.departments.includes(dept);

        return (
          <div
            key={dept}
            onClick={() => toggle(dept)}
            className="flex items-center gap-2 cursor-pointer py-1"
          >
            {/* Custom Tick */}
            <span
              className={`text-lg font-bold ${
                selected ? "text-blue-600" : "text-gray-400"
              }`}
            >
              ✓
            </span>

            <span className="text-sm">{dept}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentsPanel;
