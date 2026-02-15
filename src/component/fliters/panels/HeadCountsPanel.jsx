import React from "react";
import selectIcon from "../../../assets/select.svg";
import unselectIcon from "../../../assets/unselect.svg";

const HeadCountsPanel = ({ filters, setFilters }) => {
  const options = [
    "Highest to Lowest",
    "Lowest to Highest",
    "1-5",
    "5-10",
    "10-15",
    "15-20",
  ];

  const toggle = (opt) => {
    setFilters((prev) => ({
      ...prev,
      headcounts: opt,
    }));
  };

  const selectedOption = filters.headcounts;

  return (
    <div>
      <h3 className="font-semibold mb-2">Headcounts</h3>

      {options.map((opt) => {
        const selected = selectedOption === opt;

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

export default HeadCountsPanel;
