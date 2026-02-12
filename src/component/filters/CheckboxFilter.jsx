export default function CheckboxFilter({
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
        {options.map(option => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm">
              {option}
            </span>
          </label>
        ))}
      </div>
    );
  }
  