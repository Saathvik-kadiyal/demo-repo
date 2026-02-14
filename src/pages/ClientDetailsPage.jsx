import { useEffect, useState, useCallback } from "react";
import "../index.css";

import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import ClientsOverviewChart from "../visuals/ClientOverviewChart";

import { fetchDashboardIndividualClientDetails } from "../utils/helper";

/* -------------------------
   PAYLOAD NORMALIZER
------------------------- */
const normalizePayload = ({ clientName, years, months }) => {
  const payload = {
    client_name: clientName,
  };

  if (Array.isArray(years) && years.length > 0) {
    payload.years = years.map(Number);
  }

  if (Array.isArray(months) && months.length > 0) {
    payload.months = months.map(Number);
  }

  return payload;
};

/* -------------------------
   CLIENT DETAILS PAGE
------------------------- */
export default function ClientDetailsPage({
  clientName,
  years = [],
  months = [],
}) {
  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);

  const fetchClientDetails = useCallback(async () => {
    if (!clientName) return;

    try {
      setLoading(true);

      const payload = normalizePayload({ clientName, years, months });
      const response = await fetchDashboardIndividualClientDetails(payload);

      setKpiData(response.summary ?? null);

      const rows = response.clients
        ? Object.entries(response.clients).map(([name, info]) => ({
            company: name,
            ...info,
          }))
        : [];

      setTableData(rows);
      setChartData(rows);
    } catch (err) {
      console.error("Client details error:", err);
      setTableData([]);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [clientName, years, months]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">
      {/* TITLE */}
      <h2 className="text-xl font-semibold mb-4">{clientName}</h2>

      {/* KPI SECTION */}
      <div className="flex flex-wrap gap-4 mb-4">
        <ShiftKpiCard
          loading={loading}
          ShiftType="Departments"
          ShiftCount={kpiData?.departments ?? 0}
        />
        <ShiftKpiCard
          loading={loading}
          ShiftType="Headcount"
          ShiftCount={kpiData?.headcount ?? 0}
        />
        <ShiftKpiCard
          loading={loading}
          ShiftType="Allowance"
          ShiftCount={`₹${Number(
            kpiData?.total_allowance ?? 0
          ).toLocaleString()}`}
        />
      </div>

      {/* TABLE + CHART */}
      <div className="mt-4 flex gap-4">
        {/* TABLE */}
        <div className="w-[60%] rounded-xl bg-white py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p>Loading...</p>
            </div>
          ) : (
            <ReusableTable
              data={tableData}
              message="No data found"
              columns={[
                { label: "Departments", key: "departments" },
                { label: "Headcount", key: "headcount" },
                {
                  label: "Total Allowance",
                  key: "total_allowance",
                  render: (row) =>
                    `₹${Number(row.total_allowance ?? 0).toLocaleString()}`,
                },
              ]}
            />
          )}
        </div>

        {/* CHART */}
        <div className="w-[35%] rounded-xl bg-white py-4">
          {chartData ? (
            <ClientsOverviewChart apiResponse={{ data: chartData }} />
          ) : (
            <div className="flex h-64 items-center justify-center text-gray-400">
              No chart data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
