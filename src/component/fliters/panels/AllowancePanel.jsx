import React from "react";
import selectIcon from "../../../assets/select.svg";
import unselectIcon from "../../../assets/unselect.svg";

const AllowancePanel = ({ filters, setFilters }) => {
  const options = ["100-200", "200-500", "500-1000"];
  const selectedAllowance = filters.allowance || "";

  const toggle = (opt) => {
    setFilters((prev) => ({
      ...prev,
      allowance: prev.allowance === opt ? undefined : opt,
    }));
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Allowance</h3>

      {options.map((opt) => {
        const selected = selectedAllowance === opt;

        return (
          <div
            key={opt}
            onClick={() => toggle(opt)}
            className="flex items-center gap-2 cursor-pointer py-4 px-2 border-b border-[#C6C8CA] hover:bg-gray-50"
          >
            <img
              src={selected ? selectIcon : unselectIcon}
              alt={selected ? "selected" : "unselected"}
              className="w-4 h-4"
            />
            <span className="text-sm">{opt}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AllowancePanel;
