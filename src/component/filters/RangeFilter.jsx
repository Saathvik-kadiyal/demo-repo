export default function RangeFilter({
    options,
    value,
    onChange
  }) {
  
    const toggle = option => {
      if (value.includes(option)) {
        onChange(value.filter(v => v !== option));
      } else {
        onChange([...value, option]);
      }
    };
  
    return (
      <div className="space-y-2">
        {options.map(range => (
          <label
            key={range}
            className="flex items-center gap-2"
          >
            <input
              type="checkbox"
              checked={value.includes(range)}
              onChange={() => toggle(range)}
              className="accent-blue-600"
            />
            {range}
          </label>
        ))}
      </div>
    );
  }
  