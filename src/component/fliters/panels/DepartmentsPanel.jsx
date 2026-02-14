import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

const DepartmentsPanel = ({ filters, setFilters }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ safe fallback
  const selectedDepartments = filters.departments ?? [];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/client-departments", {
          withCredentials: true,
        });
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const toggle = (dept) => {
    const next = selectedDepartments.includes(dept)
      ? selectedDepartments.filter((d) => d !== dept)
      : [...selectedDepartments, dept];

    setFilters((prev) => {
      if (next.length === 0) {
        const copy = { ...prev };
        delete copy.departments;
        return copy;
      }

      return {
        ...prev,
        departments: next,
      };
    });
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Departments</h3>

      {loading && <p className="text-sm text-gray-400">Loading...</p>}

      {departments.length > 0 &&
        departments.map((dept) => {
          const selected = selectedDepartments.includes(dept);

          return (
            <div
              key={dept}
              onClick={() => toggle(dept)}
              className="flex items-center gap-2 cursor-pointer py-1"
            >
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
