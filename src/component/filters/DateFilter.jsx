export default function DateFilter({ value, onChange }) {

    return (
      <div className="flex flex-col gap-3">
        <input
          type="number"
          placeholder="Year"
          value={value.year || ""}
          onChange={e =>
            onChange({ ...value, year: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />
  
        <input
          type="text"
          placeholder="Months (Jan, Feb)"
          value={value.months || ""}
          onChange={e =>
            onChange({ ...value, months: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        />
      </div>
    );
  }
  