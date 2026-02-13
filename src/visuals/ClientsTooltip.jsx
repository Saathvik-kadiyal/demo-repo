import { CLIENT_ENUMS } from "../utils/enums";

function ClientsTooltip({ active, payload, coordinate, meta }) {
  if (!active || !payload || !payload.length || !coordinate) return null;

  const d = payload[0].payload;
  const info = meta[d.name];
  if (!info) return null;

  const { x, y } = coordinate; // mouse position

  return (
    <>
      {/* Connector Line */}
     {/* <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-40">
  <circle cx={x} cy={y} r="4" fill="#9ca3af" />

  <line
    x1={x}
    y1={y}
    x2={x + 140}
    y2={y - 40}
    stroke="#9ca3af"
    strokeWidth="1.5"
    strokeDasharray="4 4"
  />
</svg> */}


      {/* Tooltip Card */}
      <div
        className="absolute z-50 w-44 p-3 bg-white rounded-lg shadow-lg pointer-events-auto"
        style={{
          left: 240,
          top: -40,
        }}
      >
        {/* Title */}
        <div className="text-[#1f3a8a] font-semibold text-base mb-3">
          {CLIENT_ENUMS[d.name] || d.fullName || d.name}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Allowances</span>
            <span className="font-semibold text-[#1f3a8a]">
              ${Number(d.value).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-black">Headcounts</span>
            <span className="font-medium tetxt-white">{info.headcounts}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-black">Shifts</span>
            <span className="font-medium">{info.shifts}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-black">Departments</span>
            <span className="font-medium">{info.departments}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientsTooltip;