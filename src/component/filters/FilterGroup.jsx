import CheckboxFilter from "./CheckBoxFilter";
import DateFilter from "./DateFilter";
import RangeFilter from "./RangeFilter";

export default function FilterGroup({ filter, value, onChange }) {
  return (
    <div className="mb-8">
      <h3 className="font-semibold mb-3">
        {filter.label}
      </h3>

      {filter.type === "checkbox" && (
        <CheckboxFilter
          options={filter.options}
          value={value || []}
          onChange={onChange}
        />
      )}

      {filter.type === "range" && (
        <RangeFilter
          options={filter.options}
          value={value || []}
          onChange={onChange}
        />
      )}

      {filter.type === "dateRange" && (
        <DateFilter
          value={value || {}}
          onChange={onChange}
        />
      )}
    </div>
  );
}
