import { useEffect, useState, useCallback, useMemo } from "react";
import "../index.css";
import allowanceIcon from "../assets/allowance.svg"
import departmentsIcon from "../assets/departments.svg"
import peopleIcon from "../assets/people.svg"
import clientsIcon from "../assets/clients.svg"
import KpiCard from "../component/kpicards/KpiCard";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import arrow from "../assets/arrow.svg";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { fetchDashboardIndividualClientDetails } from "../utils/helper";
import {
  clientDetailClientPartnersColumns,
  clientDetailEmployeesColumns,
} from "../component/ReusableTable/columns";
import { all } from "axios";
import { formatRupeesWithUnit } from "../utils/utils";
import { useNavigate } from "react-router-dom";

/* -------------------------
   PAYLOAD BUILDER
------------------------- */
const buildPayload = ({ clientName, years, months }) => {
  const payload = {
    clients: Array.isArray(clientName)
      ? clientName
      : clientName
      ? [clientName]
      : [],
  };

  if (Array.isArray(years) && years.length > 0) {
    payload.years = years;
  }

  if (Array.isArray(months) && months.length > 0) {
    payload.months = months;
  }

  return payload;
};

export default function ClientDetailsPage({
  clientName,
  years = [],
  months = [],
}) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState("shifts");
  const navigate = useNavigate();

  /* -------------------------
     FETCH CLIENT DETAILS
  ------------------------- */
  const fetchClientDetails = useCallback(async () => {
    try {
      setLoading(true);

      const payload = buildPayload({ clientName, years, months });
      const res = await fetchDashboardIndividualClientDetails(payload);

      setSummary(res?.summary ?? null);
      setClientData(res?.clients?.[clientName] ?? null);
    } catch (err) {
      console.error("Client details error:", err);
      setSummary(null);
      setClientData(null);
    } finally {
      setLoading(false);
    }
  }, [clientName, years, months]);

  useEffect(() => {
    fetchClientDetails();
  }, [fetchClientDetails]);

  /* -------------------------
     TABLE DATA (Partner → Employees)
  ------------------------- */
const tableData = useMemo(() => {
  if (!clientData?.client_partners) return [];

  return Object.entries(clientData.client_partners).map(
    ([partnerName, partner]) => {
      const shifts = partner.shifts_summary || {};

      return {
        name: partnerName,
        head_count: partner.headcount ?? 0,
        total: partner.total_allowance ?? 0,

        shifts: {
          ANZ: shifts.ANZ ?? 0,
          PST_MST: shifts.PST_MST ?`${formatRupeesWithUnit(shifts.PST_MST)}` : 0,
          US_INDIA: shifts.US_INDIA ?`${formatRupeesWithUnit(shifts.US_INDIA)}` : 0,
          SG: shifts.SG ?`${formatRupeesWithUnit(shifts.SG)}` : 0,
          US3: shifts.US3 ?`${formatRupeesWithUnit(shifts.US3)}` : 0,
        },

        children: (partner.employees || []).map((emp) => {
          const empShifts = emp.shifts_summary || {};
console.log("Employee data:", empShifts);
          return {
            type: "employee",  
            name: emp.emp_name,
            emp_id: emp.emp_id,
            department: emp.department,
            total: emp.total_allowance ?? 0,

            shifts: {
              ANZ: emp.ANZ ? `${formatRupeesWithUnit(emp.ANZ)}` : 0,
              PST_MST: emp.PST_MST ? `${formatRupeesWithUnit(emp.PST_MST)}` : 0,
              US_INDIA: emp.US_INDIA ? `${formatRupeesWithUnit(emp.US_INDIA)}` : 0,
              SG: emp.SG ? `${formatRupeesWithUnit(emp.SG)}` : 0,
              US3: emp.US3 ? `${formatRupeesWithUnit(emp.US3)}` : 0,
            },
          };
        }),
      };
    }
  );
}, [clientData]);




  /* -------------------------
     CHART DATA
  ------------------------- */
  const chartData = useMemo(() => {
  if (!clientData) return [];

  const source =
    activeChartTab === "shifts"
      ? clientData.shifts_summary
      : clientData.department_summary;

  if (!source) return [];

  return Object.entries(source).map(([key, value]) => ({
    name: key,
     amount: Number(value), 
  }));
}, [clientData, activeChartTab]);


  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">
      {/* TITLE */}
      {/* <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
         <img src={arrow} alt="back"
          style={{ width: 16, height: 16,  transform:"rotate(90deg)"}} 
           onClick={() => navigate("/")}/>
        <span>{clientName}</span></h2> */} 

        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
  <div
    onClick={() => navigate("/")}
    className="flex items-center justify-center cursor-pointer p-2 hover:bg-gray-200 rounded-full"
  >
    <img
      src={arrow}
      alt="back"
      className="w-[18px] h-[16px] rotate-90"
    />
  </div>
  <span>{clientName}</span>
</h2>


      {/* KPI CARDS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <KpiCard
          loading={loading}
          HeaderIcon={allowanceIcon}
          HeaderText="Total Allowance"
          BodyNumber={`₹${Number(
            summary?.total_allowance ?? 0
          ).toLocaleString()}`}
          BodyComparisionNumber=""
        />

        <KpiCard
          loading={loading}
          HeaderIcon={departmentsIcon}
          HeaderText="Departments"
          BodyNumber={summary?.departments ?? 0}
          BodyComparisionNumber=""
        />

        <KpiCard
          loading={loading}
          HeaderIcon={peopleIcon}
          HeaderText="Client Partners"
     BodyNumber={clientData?.client_partner_count ?? 0}
          BodyComparisionNumber=""
        />
         <KpiCard
          loading={loading}
          HeaderIcon={peopleIcon}
          HeaderText="Headcount"
          BodyNumber={summary?.headcount ?? 0}
          BodyComparisionNumber=""
        />
      </div>

      {/* TABLE + CHART */}
      <div className="flex gap-6 flex-col">
        {/* TABLE */}
        <div className="rounded-xl bg-white py-4">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              Loading...
            </div>
          ) : (
            <ReusableTable
              data={tableData}
              message="No data found"
              columns={clientDetailClientPartnersColumns}
              nestedColumns={clientDetailEmployeesColumns}
            />
          )}
        </div>

        {/* BAR CHART */}
       {/* BAR CHART */}
<div className="rounded-xl bg-white p-4">
  <div className="flex items-center justify-between mb-4">
    <p className="text-sm font-medium">
      {activeChartTab === "shifts"
        ? "Shift Allowance Distribution"
        : "Department Allowance Distribution"}
    </p>

    {/* TABS */}
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setActiveChartTab("shifts")}
        className={`px-3 py-1 text-sm rounded-md transition ${
          activeChartTab === "shifts"
            ? "bg-white shadow text-black"
            : "text-gray-500"
        }`}
      >
        Shifts
      </button>

      <button
        onClick={() => setActiveChartTab("departments")}
        className={`px-3 py-1 text-sm rounded-md transition ${
          activeChartTab === "departments"
            ? "bg-white shadow text-black"
            : "text-gray-500"
        }`}
      >
        Departments
      </button>
    </div>
  </div>

  {chartData.length > 0 ? (
  <ResponsiveContainer width="100%" height={260}>
  <BarChart
    data={chartData}
    barCategoryGap="40%"
  >
    <XAxis
      dataKey="name"
      tick={{ fontSize: 12 }}
    />
 <YAxis
  tickFormatter={(value) => formatRupeesWithUnit(value)}
  fontSize={12}
  
/>

 <Tooltip
  formatter={(value) => formatRupeesWithUnit(value)}
/>

    <Bar
      dataKey="amount"
      barSize={25}
      radius={[6, 6, 0, 0]}
      shape={(props) => {
        const { x, y, width, height, index } = props;
        const fillColor = index % 2 === 0 ? "#15549D" : "#3585E4";

        return (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={fillColor}
            rx={6}
          />
        );
      }}
    />
  </BarChart>
</ResponsiveContainer>


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
