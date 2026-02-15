const AllowancePanel = ({ filters, setFilters }) => {
  const options = ["100-200", "200-500", "500-1000"];

  return (
    <div>
      <h3>Allowance</h3>
      {options.map(opt => (
        <label key={opt}>
          <input
            type="radio"
            checked={filters.allowance === opt}
            onChange={() =>
              setFilters({ ...filters, allowance: opt })
            }
          />
          {opt}
        </label>
      ))}
    </div>
  );
};

export default AllowancePanel;