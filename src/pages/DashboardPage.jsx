import { useEffect, useState, useCallback, useMemo } from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

import ReusableTable from "../component/ReusableTable/ReusableTable";
import ClientsOverviewChart from "../visuals/ClientOverviewChart";
import { FilterDrawer } from "../component/fliters";
import allowanceIcon from "../assets/allowance.svg";
import departmentsIcom from "../assets/departments.svg";
import peopleIcon from "../assets/people.svg";
import clientsIcon from "../assets/clients.svg";
import { dashboardColumns, dashboardDepartmentColumns } from "../component/ReusableTable/columns";

import {
  fetchDashboardKpiSummary,
  fetchDashboardClientGraph,
  fetchDashboardTable,
  fetchDashboardDepartmentTable,
  debounce,
} from "../utils/helper";
import SearchInput from "../component/SearchInput";
import KpiCard from "../component/kpicards/KpiCard";
import Pagination from "../component/pagination/Pagination";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kpiData, setKpiData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [departmentsData,setDepartmentsData]=useState([])

  const [clientSearch, setClientSearch] = useState("");
  const [departmentSearch, setDepartmentSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [departmentCurrentPage,setDepartmentsCurrentPage] = useState(1)
  const [rows, setRows] = useState(5);

  const navigate = useNavigate();

  const NoOfClientPages = Math.ceil(tableData.length / rows) || 1;
  const NoOfDepartmentPages = Math.ceil(departmentsData.length/rows)||1
  const paginatedClientsData = tableData.slice(rows * (currentPage - 1), rows * currentPage);
  const paginatedDepartmentsData = departmentsData?.slice(rows*(departmentCurrentPage-1),rows*departmentCurrentPage);
  // const paginatedDepartmentsData 

  /* -------------------------
     NORMALIZE FILTERS
  ------------------------- */
  const normalizeFilters = (filters = {}) => {
    const payload = {
      clients: filters.clients || "ALL",
      departments: filters.departments || "ALL",
      sort_by: "total_allowance",
      sort_order: "default",
      top: "ALL",
    };

    if (Array.isArray(filters.years) && filters.years.length > 0) {
      const years = filters.years.map(Number).filter((y) => Number.isInteger(y) && y >= 2000);
      if (years.length) payload.years = years;
    }

    if (Array.isArray(filters.months) && filters.months.length > 0) {
      const months = filters.months.map(Number).filter((m) => m >= 1 && m <= 12);
      if (months.length) payload.months = months;
    }

    if (filters.headcounts && filters.headcounts !== "ALL") payload.headcounts = filters.headcounts;
    if (filters.top && filters.top !== "ALL") payload.top = filters.top;

    return payload;
  };

  /* -------------------------
     TABLE FETCHERS
  ------------------------- */
  const fetchClientsTable = useCallback(async (payload, clientStartsWith = "") => {
    try {
      const res = await fetchDashboardTable(payload, {
        ...(clientStartsWith ? { client_starts_with: clientStartsWith } : {}),
      });
      const dashboardData = res.dashboard
        ? Object.entries(res.dashboard).map(([company, info]) => ({ company, ...info }))
        : [];
      setTableData(dashboardData);
    } catch (err) {
      console.error("Clients table fetch error:", err);
      setTableData([]);
    }
  }, []);

  const fetchDepartmentsTable = useCallback(async (payload, departmentStartsWith = "") => {
    try {
      const res = await fetchDashboardDepartmentTable(payload, {
        ...(departmentStartsWith ? { department_starts_with: departmentStartsWith } : {}),
      });
       const dashboardData = res.dashboard
        ? Object.entries(res.dashboard).map(([department, info]) => ({ department, ...info }))
        : [];
      console.log(res)
      setDepartmentsData(dashboardData || []);
    } catch (err) {
      console.error("Departments table fetch error:", err);
      setDepartmentsData([]);
    }
  }, []);

  const debouncedTableFetch = useCallback(debounce(fetchClientsTable, 500), [fetchClientsTable]);
  const debouncedDepartmentTableFetch = useCallback(debounce(fetchDepartmentsTable, 500), [fetchDepartmentsTable]);

  /* -------------------------
     MAIN DASHBOARD FETCH
  ------------------------- */
  const fetchDashboard = useCallback(async (rawFilters = {}) => {
    const payload = normalizeFilters(rawFilters);
    try {
      setLoading(true);
      setError(null);

      const [kpiResponse, chartResponse] = await Promise.all([
        fetchDashboardKpiSummary(payload),
        fetchDashboardClientGraph(payload),
      ]);

      setKpiData(kpiResponse?.summary ?? null);
      setChartData(chartResponse?.data ?? null);

      if (departmentSearch?.trim()) {
        debouncedDepartmentTableFetch(payload, departmentSearch.trim());
      } else if (clientSearch?.trim()) {
        debouncedTableFetch(payload, clientSearch.trim());
      } else {
         await Promise.all([
        fetchClientsTable(payload),
        fetchDepartmentsTable(payload),
      ]);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.message || "Failed to load dashboard");
      setKpiData(null);
      setChartData(null);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [ fetchClientsTable, fetchDepartmentsTable, debouncedTableFetch, debouncedDepartmentTableFetch]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);
  const handleTopChange = useCallback((top) => {
  fetchDashboard({ top });
}, [fetchDashboard]);

  useEffect(() => {
  const payload = normalizeFilters({});
  if (clientSearch.trim()) {
    debouncedTableFetch(payload, clientSearch.trim());
  } else {
    fetchClientsTable(payload);
  }
}, [clientSearch]);

useEffect(() => {
  const payload = normalizeFilters({});
  if (departmentSearch.trim()) {
    debouncedDepartmentTableFetch(payload, departmentSearch.trim());
  } else {
    fetchDepartmentsTable(payload);
  }
}, [departmentSearch]);

  const handleFilterApply = (filters) => fetchDashboard(filters);

  const memoizedChartData = useMemo(() => {
  return { data: chartData };
}, [chartData]);

const handleDashboardAction = (row, type) => {
  const filters = type === "client" 
    ? { clients: row.company } 
    : { departments: row.department };

  const payload = normalizeFilters(filters);

  navigate("/client", {
    state: {
      clientName: row.company ,
      departmentName:row.departments,
      years: payload.years ?? [],
      months: payload.months ?? [],
    },
  });
};




  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">
      {error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex justify-end mb-2">
        <FilterDrawer onApply={handleFilterApply} />
      </div>

      {/* KPI CARDS */}
      <div className="flex flex-wrap gap-4 mb-4">
        <KpiCard loading={loading} HeaderIcon={clientsIcon} HeaderText="Clients" BodyNumber={kpiData?.total_clients ?? 0} BodyComparisionNumber={kpiData?.total_clients_last_month ?? ""} />
        <KpiCard loading={loading} HeaderIcon={departmentsIcom} HeaderText="Departments" BodyNumber={kpiData?.total_departments ?? 0} BodyComparisionNumber={kpiData?.total_departments_last_month ?? ""} />
        <KpiCard loading={loading} HeaderIcon={peopleIcon} HeaderText="Headcount" BodyNumber={kpiData?.head_count ?? 0} BodyComparisionNumber={kpiData?.head_count_last_month ?? ""} />
        <KpiCard loading={loading} HeaderIcon={allowanceIcon} HeaderText="Allowance" BodyNumber={`₹${Number(kpiData?.total_allowance ?? 0).toLocaleString()}`} BodyComparisionNumber={kpiData?.total_allowance_last_month ?? ""} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">

<div className="flex flex-col gap-4">
    {/* CLIENTS TABLE */}
  <div className="rounded-xl bg-white py-4 flex flex-col gap-4">
    <div className="px-4 flex justify-end">
      <SearchInput
        value={clientSearch}
        onChange={setClientSearch}
        placeholder="Search clients..."
      />
    </div>

    {loading ? (
      <div className="flex min-h-64 items-center justify-center">
        <p>Loading...</p>
      </div>
    ) : (
      <div className=" flex flex-col gap-4">
        <ReusableTable
          data={paginatedClientsData}
          columns={dashboardColumns}
          message="No clients found"
          onActionClick={handleDashboardAction}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={NoOfClientPages}
          onPageChange={setCurrentPage}
        />
      </div>
    )}
  </div>

  {/* DEPARTMENTS TABLE */}
  <div className="rounded-xl bg-white py-4 flex flex-col gap-4">
    <div className="px-4 flex justify-end">
      <SearchInput
        value={departmentSearch}
        onChange={setDepartmentSearch}
        placeholder="Search departments..."
      />
    </div>

    {loading ? (
      <div className="flex min-h-64 items-center justify-center">
        <p>Loading...</p>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        <ReusableTable
          data={paginatedDepartmentsData}
          columns={dashboardDepartmentColumns}
          message="No departments found"
          onActionClick={handleDashboardAction}
        />
        <Pagination
          currentPage={departmentCurrentPage}
          totalPages={NoOfDepartmentPages}
          onPageChange={setDepartmentsCurrentPage}
        />
      </div>
    )}
  </div>
</div>

  {/* CHART */}
  <div className="rounded-xl bg-white p-4">
    {chartData ? (
     <ClientsOverviewChart
  apiResponse={memoizedChartData}
  onTopChange={handleTopChange}
/>
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
