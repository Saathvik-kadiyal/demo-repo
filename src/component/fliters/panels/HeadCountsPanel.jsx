const HeadCountsPanel = ({ filters, setFilters }) => {
  const options = [
    "Highest to Lowest",
    "Lowest to Highest",
    "1-5",
    "5-10",
    "10-15",
    "15-20",
  ];

  const select = (opt) => {
    setFilters({ ...filters, headcounts: opt });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Headcounts
      </h3>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const active = filters.headcounts === opt;

          return (
            <div
              key={opt}
              onClick={() => select(opt)}
              className="flex items-center gap-3 cursor-pointer py-1"
            >
              {/* Tick */}
              <span
                className={`text-lg font-bold ${
                  active ? "text-blue-600" : "text-gray-300"
                }`}
              >
                ✓
              </span>

              {/* Label */}
              <span
                className={`text-sm ${
                  active ? "text-blue-600 font-medium" : "text-gray-700"
                }`}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeadCountsPanel;
