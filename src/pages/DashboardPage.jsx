import { useEffect, useState, useCallback } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";


import ReusableTable from "../component/ReusableTable/ReusableTable";
import ActionButton from "../component/buttons/ActionButton";
import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";
import ClientsOverviewChart from "../visuals/ClientOverviewChart";
import { FilterDrawer } from "../component/fliters";
import allowanceIcon from "../assets/allowance.svg"
import departmentsIcom from "../assets/departments.svg"
import peopleIcon from "../assets/people.svg"
import clientsIcon from "../assets/clients.svg"
import { dashboardColumns } from "../component/ReusableTable/columns";

import {
  fetchDashboardKpiSummary,
  fetchDashboardClientGraph,
  fetchDashboardTable,
  debounce,
  fetchDashboardIndividualClientDetails,
} from "../utils/helper";
import SearchInput from "../component/SearchInput";
import KpiCard from "../component/kpicards/KpiCard";

/* -------------------------
   FILTER NORMALIZER
------------------------- */
const normalizeFilters = (filters = {}) => {
  const payload = {
    clients: filters.client || "ALL",
    departments: filters.departments || "ALL",
    sort_by: "total_allowance",
    sort_order: "default",
    top: "ALL",
  };

  if (Array.isArray(filters.years) && filters.years.length > 0) {
    const years = filters.years
      .map(Number)
      .filter((y) => Number.isInteger(y) && y >= 2000);
    if (years.length > 0) payload.years = years;
  }

  if (Array.isArray(filters.months) && filters.months.length > 0) {
    const months = filters.months.map(Number).filter((m) => m >= 1 && m <= 12);
    if (months.length > 0) payload.months = months;
  }

  if (filters.headcounts && filters.headcounts !== "ALL") payload.headcounts = filters.headcounts;
 if (filters.top && filters.top !== "ALL") {
  payload.top = filters.top;
}


  return payload;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kpiData, setKpiData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  /* -------------------------
     FETCH TABLE DATA
  ------------------------- */
  const fetchTableData = useCallback(async (payload) => {
    try {
      const tableResponse = await fetchDashboardTable(payload);

      // Convert dashboard object into array
      const dashboardData = tableResponse.dashboard
        ? Object.entries(tableResponse.dashboard).map(([company, info]) => ({
            company,
            ...info,
          }))
        : [];

      // Apply search filter if any
      const filteredData = search
        ? dashboardData.filter((row) =>
            row.company.toLowerCase().includes(search.toLowerCase())
          )
        : dashboardData;
        console.log("Fetched and filtered table data:", filteredData);

      setTableData(filteredData);
    } catch (err) {
      console.error("Table fetch error:", err);
      setTableData([]);
    }
  }, [search]);

  // Debounce search
  const debouncedTableFetch = useCallback(debounce(fetchTableData, 500), [fetchTableData]);

  /* -------------------------
     MAIN DASHBOARD FETCH
  ------------------------- */
  const fetchDashboard = useCallback(async (rawFilters = {}) => {
    const payload = normalizeFilters(rawFilters);

    try {
      setLoading(true);
      setError(null);

      // KPI + Chart
      const [kpiResponse, chartResponse] = await Promise.all([
        fetchDashboardKpiSummary(payload),
        fetchDashboardClientGraph(payload),
      ]);

      setKpiData(kpiResponse?.summary ?? null);
      setChartData(chartResponse?.data ?? null);

      // TABLE
      if (search) {
        debouncedTableFetch(payload);
      } else {
        await fetchTableData(payload);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard");
      setKpiData(null);
      setTableData([]);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [search, fetchTableData, debouncedTableFetch]);

  /* -------------------------
     INITIAL LOAD
  ------------------------- */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* -------------------------
     FILTER APPLY
  ------------------------- */
  const handleFilterApply = (filters) => {
    fetchDashboard(filters);
  };


const handleDashboardAction = (row) => {
  const payload = normalizeFilters({ client: row.company });

  navigate("/client", {
  state: {
    clientName: row.company,
    years: payload.years ?? [],
    months: payload.months ?? [],
  },
});

};





  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
    <div className="flex flex-col gap-2 ">
         <div className="flex justify-end">
        <FilterDrawer onApply={handleFilterApply} />
       </div>

     

    </div>

     {/* KPI SECTION */}
      <div className="flex flex-wrap gap-4 mb-4">
    <KpiCard
  loading={loading}
  HeaderIcon={clientsIcon}
  HeaderText="Clients"
  BodyNumber={kpiData?.total_clients ?? 0}
  BodyComparisionNumber={kpiData?.total_clients_last_month ?? ""}
  width="444px"
/>

<KpiCard
  loading={loading}
  HeaderIcon={departmentsIcom}
  HeaderText="Departments"
  BodyNumber={kpiData?.total_departments ?? 0}
  BodyComparisionNumber={kpiData?.total_departments_last_month ?? ""}
/>

<KpiCard
  loading={loading}
  HeaderIcon={peopleIcon}
  HeaderText="Headcount"
  BodyNumber={kpiData?.head_count ?? 0}
  BodyComparisionNumber={kpiData?.head_count_last_month ?? ""}
/>

<KpiCard
  loading={loading}
  HeaderIcon={allowanceIcon}

  HeaderText="Allowance"
  BodyNumber={`₹${Number(kpiData?.total_allowance ?? 0).toLocaleString()}`}
  BodyComparisionNumber={kpiData?.total_allowance_last_month ?? ""}
/>

      </div>
     

      {/* TABLE + CHART */}
      <div className="mt-4 flex gap-4">
        {/* TABLE */}
        <div className="w-[60%] rounded-xl bg-white py-4 flex flex-col gap-2 h-full">
          <div className="px-4 flex justify-end">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search clients..."
            />
          </div>

          <div>
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <ReusableTable
                data={tableData}
                columns={dashboardColumns}
                message="No clients found"
                 onActionClick={handleDashboardAction} 
              />
            )}
          </div>
        </div>

        {/* CHART */}
        <div className="flex-1 rounded-xl bg-white ">
          {chartData ? (
            <ClientsOverviewChart apiResponse={{ data: chartData }}   onTopChange={(top) => {
    fetchDashboard({ top });
  }} />
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
