import { useState, useEffect } from "react";
import "../index.css";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import ActionButton from "../component/buttons/ActionButton";
import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";

import { normalizeDashboardData } from "../component/ReusableTable/normalizeApiData";
import { dashboardColumns } from "../component/ReusableTable/columns";
import { rawDataSet1, rawDataSet2 } from "./dummyData";
import ClientsOverviewChart from "../visuals/ClientOverviewChart";
import { FilterDrawer } from "../component/fliters";
import { fetchClientAllowanceSummary } from "../api/dashboardApi"; // adjust path as needed

export default function DashboardPage() {
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current year and month
  const getCurrentYearMonth = () => {
    const now = new Date();
    return {
      year: [now.getFullYear()],
      months: [now.getMonth() + 1], // JavaScript months are 0-indexed
      client: ["All"],
      departments: ["ALL"]
    };
  };

  // Fetch dashboard data
  const fetchDashboardData = async (filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchClientAllowanceSummary(filters);
      if (response) {
        setTableData(normalizeDashboardData(response.tableData || response));
        setChartData(response.chartData || response);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
      setTableData(normalizeDashboardData(rawDataSet1));
      setChartData(rawDataSet2);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialFilters = getCurrentYearMonth();
    fetchDashboardData(initialFilters);
  }, []);

  const handleUpload = () => {
  };

  const handleFilterApply = (filters) => {
    const apiFilters = {
      year: filters.years || [],
      months: filters.months || [],
      client: filters.client || [],
      departments: filters.departments || []
    };
  
    if (filters.employeeId) {
      apiFilters.employeeId = filters.employeeId;
    }
    if (filters.allowance) {
      apiFilters.allowance = filters.allowance;
    }
    if (filters.headcounts) {
      apiFilters.headcounts = filters.headcounts;
    }

    fetchDashboardData(apiFilters);
  };

  return (
    <div
      className={`
        relative w-full justify-center px-4 py-4 overflow-x-hidden
        ${clientDialogOpen ? "overflow-y-hidden h-full" : "overflow-y-auto h-auto"}
      `}
    >
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* KPI */}
      <div className="flex flex-wrap gap-4">
        <ShiftKpiCard
          loading={loading}
          ShiftType="USA"
          ShiftCount={20}
          ShiftCountry="USA/IND"
          ShiftCountSize="2rem"
          ShiftTypeSize="2rem"
        />
      </div>

      {/* ACTION */}
      <ActionButton
        content={() => (
          <button className="actionBtn" onClick={handleUpload}>
            <span>+</span>
            <p>Upload File</p>
          </button>
        )}
      />

      <div>
        <FilterDrawer onApply={handleFilterApply} />
      </div>

      {/* TABLE */}
      <div className="flex gap-4 mt-4">
        <div className="w-[60%] rounded-xl py-4 overflow-x-auto bg-white">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p>Loading...</p>
            </div>
          ) : (
            <ReusableTable data={tableData} columns={dashboardColumns} />
          )}
        </div>
        <div className="w-[35%] rounded-xl py-4 overflow-x-auto bg-white">
          <ClientsOverviewChart apiResponse={chartData || rawDataSet2} />
        </div>
      </div>
    </div>
  );
}