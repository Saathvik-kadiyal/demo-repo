const HeadCountsPanel = ({ filters, setFilters }) => {
  const options = [
    "Highest to Lowest",
    "Lowest to Highest",
    "1-5",
    "5-10",
    "10-15",
    "15-20"
  ];

  return (
    <div>
      <h3>Headcounts</h3>
      {options.map(opt => (
        <label key={opt}>
          <input
            type="radio"
            checked={filters.headcounts === opt}
            onChange={() =>
              setFilters({ ...filters, headcounts: opt })
            }
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default HeadCountsPanel;