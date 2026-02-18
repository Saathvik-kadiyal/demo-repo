import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import ClientsTooltip from "./ClientsTooltip";
import { CLIENT_ENUMS } from "../utils/enums";
import "../index.css";
const REVERSE_ENUM = Object.fromEntries(
  Object.entries(CLIENT_ENUMS).map(([k, v]) => [v, k])
);

const SHORT_LABELS = {
  ATD: "ATD",
  DZS: "DZS",
  CHEP: "CHEP",
  LEASELOCK: "LeaseLock",
  ILC_DOVER: "ILC",
  VERTISYSTEMS: "Verti",
  CLAIR_SOURCE: "Clair",
};
export function normalizeClientsApi(api) {
  if (!api || !Array.isArray(api.data)) {
    return { chartData: [], meta: {} };
  }

  const meta = {};

  const chartData = api.data.map((c) => {
    const enumKey = REVERSE_ENUM[c.client] || c.client;

    meta[enumKey] = {
      allowances: c.total_allowance,
      headcounts: c.headcount,
      shifts: Object.keys(c.shifts || {}).length,
      departments: c.departments?.length || 0,
    };

    return {
      name: enumKey,
      label: SHORT_LABELS[enumKey] || enumKey,
      fullName: c.client,
      value: c.total_allowance,
    };
  });

  return { chartData, meta };
}

// -----------------------------
// Color Generator
// -----------------------------
function generateColors(n) {
  const base = [
    "#0D3B66",
    "#1C6ED5",
    "#3584E4",
    "#6EA8EB",
    "#9AC4F8",
    "#C9E1FB",
  ];
  const colors = [];
  for (let i = 0; i < n; i++) colors.push(base[i % base.length]);
  return colors;
}

// -----------------------------
// Chart Component
// -----------------------------
export default function ClientsOverviewChart({ apiResponse, onTopChange }) {
  const [top, setTop] = useState("ALL");

  const { chartData, meta } = useMemo(
    () => normalizeClientsApi(apiResponse),
    [apiResponse]
  );
  const colors = useMemo(
    () => generateColors(chartData.length),
    [chartData.length]
  );

  const [sortBy, setSortBy] = useState("none");

  const sortedData = useMemo(() => {
    if (sortBy === "asc")
      return [...chartData].sort((a, b) => a.value - b.value);
    if (sortBy === "desc")
      return [...chartData].sort((a, b) => b.value - a.value);
    return chartData;
  }, [chartData, sortBy]);

  return (
    <div className="p-4  justify-around flex-col h-full rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Clients Overview</h2>
        <select
          className="custom-select border rounded-sm border-[#E0E0E0] px-2 py-2 text-sm focus:outline-none w-[150px]"
          value={top}
          onChange={(e) => {
            const value = e.target.value === "ALL" ? "ALL" : e.target.value;
            setTop(value);
            onTopChange?.(value);
          }}
        >
          <option value="ALL">All</option>
          <option value="5">Top 5</option>
          <option value="10">Top 10</option>
        </select>
      </div>

      <div className="w-full flex justify-center relative mt-12">
        <div className="w-100 min-h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                dataKey="value"
                nameKey="label"
                stroke="none"
                innerRadius="40%"
                outerRadius="100%"
                paddingAngle={0}
                labelLine={false}
                minAngle={16}
                label={({
                  cx,
                  cy,
                  midAngle,
                  innerRadius,
                  outerRadius,
                  label,
                  index,
                }) => {
                  const RADIAN = Math.PI / 180;
                  const radius =
                    innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  const color = colors[index];

                  const textColor =
                    parseInt(color.replace("#", ""), 16) > 0xffffff / 2
                      ? "#000"
                      : "#fff";

                  return (
                    <g>
                      <text
                        x={x}
                        y={y - 6}
                        fill={textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={11}
                        fontWeight={600}
                      >
                        {label}
                      </text>

                      <text
                        x={x}
                        y={y + 10}
                        fill={textColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                        fontWeight={400}
                        opacity={0.85}
                      >
                        {`$${Number(sortedData[index].value).toLocaleString()}`}
                      </text>
                    </g>
                  );
                }}
              >
                {sortedData.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>

              <Tooltip
                cursor={false}
                wrapperStyle={{ visibility: "none" }} // important
                content={(props) => <ClientsTooltip {...props} meta={meta} />}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm">Clients</span>
          </div>
        </div>
      </div>
    </div>
  );
}
