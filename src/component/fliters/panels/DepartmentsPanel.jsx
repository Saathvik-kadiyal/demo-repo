import React, { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import selectIcon from "../../../assets/select.svg";
import unselectIcon from "../../../assets/unselect.svg";

const DepartmentsPanel = ({ filters, setFilters }) => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

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

      {departments.map((dept) => {
        const selected = selectedDepartments.includes(dept);

        return (
          <div
            key={dept}
            onClick={() => toggle(dept)}
            className="flex items-center gap-2 cursor-pointer py-4 px-2 border-b border-[#C6C8CA] hover:bg-gray-50"
          >
            <img
              src={selected ? selectIcon : unselectIcon}
              alt={selected ? "selected" : "unselected"}
              className="w-4 h-4"
            />
            <span className="text-sm">{dept}</span>
          </div>
        );
      })}
    </div>
  );
};

export default DepartmentsPanel;
