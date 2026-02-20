import { useEffect, useState, useCallback, useMemo } from "react";
import "../index.css";
import allowanceIcon from "../assets/allowance.svg";
import departmentsIcon from "../assets/departments.svg";
import peopleIcon from "../assets/people.svg";
import arrow from "../assets/arrow.svg";

import KpiCard from "../component/kpicards/KpiCard";
import ReusableTable from "../component/ReusableTable/ReusableTable";

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
import { formatRupeesWithUnit } from "../utils/utils";
import { useNavigate } from "react-router-dom";

/* -------------------------
   PAYLOAD BUILDER
------------------------- */
const buildPayload = ({ clientName, departmentName,years, months }) => {
  const payload = {};
if(clientName){
  payload.clientName= clientName
}
if(departmentName){
  payload.departmentName=departmentName
}
  if (years?.length) payload.years = years;
  if (months?.length) payload.months = months;

  return payload;
};

export default function ClientDetailsPage({
  clientName="",
  departmentName="",
  years = [],
  months = [],
}) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState("shifts");
  const navigate = useNavigate();
  console.log(clientName,years,months)

  /* -------------------------
     FETCH CLIENT DETAILS
  ------------------------- */
  const fetchClientDetails = useCallback(async () => {
    if (!clientName &!departmentName) return;

    try {
      setLoading(true);

      const payload = buildPayload({ clientName, departmentName, years, months });
      const res = await fetchDashboardIndividualClientDetails(payload);

      const clientObj = res?.clients?.[clientName] ?? null;

      setSummary(res?.summary ?? null);
      setClientData(clientObj);
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
     NORMALIZE PARTNERS (NEW STRUCTURE SUPPORT)
  ------------------------- */
  const normalizedPartners = useMemo(() => {
    if (!clientData) return {};

    if (clientData.departments_breakdown) {
      return Object.values(clientData.departments_breakdown).reduce(
        (acc, dept) => {
          Object.entries(dept.client_partners || {}).forEach(
            ([partnerName, partnerData]) => {
              if (!acc[partnerName]) {
                acc[partnerName] = {
                  headcount: 0,
                  total_allowance: 0,
                  shifts_summary: {},
                  employees: [],
                };
              }

              acc[partnerName].headcount += partnerData.headcount || 0;
              acc[partnerName].total_allowance +=
                partnerData.total_allowance || 0;

              Object.entries(partnerData.shifts_summary || {}).forEach(
                ([shift, value]) => {
                  acc[partnerName].shifts_summary[shift] =
                    (acc[partnerName].shifts_summary[shift] || 0) + value;
                }
              );

              acc[partnerName].employees.push(
                ...(partnerData.employees || [])
              );
            }
          );

          return acc;
        },
        {}
      );
    }

    return clientData.client_partners || {};
  }, [clientData]);

  /* -------------------------
     TABLE DATA
  ------------------------- */
const tableData = useMemo(() => {
  if (!clientData?.departments_breakdown) return [];

  return Object.entries(clientData.departments_breakdown).map(
    ([departmentName, department]) => ({
      type: "department",
      name: departmentName,
      head_count: department.headcount ?? 0,
      total: department.total_allowance ?? 0,

      shifts: {
        ANZ: formatRupeesWithUnit(department.shifts_summary?.ANZ || 0),
        PST_MST: formatRupeesWithUnit(department.shifts_summary?.PST_MST || 0),
        US_INDIA: formatRupeesWithUnit(department.shifts_summary?.US_INDIA || 0),
        SG: formatRupeesWithUnit(department.shifts_summary?.SG || 0),
      },

      children: Object.entries(department.client_partners || {}).map(
        ([partnerName, partner]) => ({
          type: "partner",
          name: partnerName,
          head_count: partner.headcount ?? 0,
          total: partner.total_allowance ?? 0,

          shifts: {
            ANZ: formatRupeesWithUnit(partner.shifts_summary?.ANZ || 0),
            PST_MST: formatRupeesWithUnit(partner.shifts_summary?.PST_MST || 0),
            US_INDIA: formatRupeesWithUnit(partner.shifts_summary?.US_INDIA || 0),
            SG: formatRupeesWithUnit(partner.shifts_summary?.SG || 0),
          },

          children: (partner.employees || []).map((emp) => ({
            type: "employee",
            name: emp.emp_name,
            emp_id: emp.emp_id,
            // department: emp.department,
            total: emp.total_allowance ?? 0,

            shifts: {
              ANZ: formatRupeesWithUnit(emp.ANZ || 0),
              PST_MST: formatRupeesWithUnit(emp.PST_MST || 0),
              US_INDIA: formatRupeesWithUnit(emp.US_INDIA || 0),
              SG: formatRupeesWithUnit(emp.SG || 0),
            },
          })),
        })
      ),
    })
  );
}, [clientData]);

  /* -------------------------
     CHART DATA
  ------------------------- */
  const chartData = useMemo(() => {
    if (!clientData) return [];

    let source = null;

    if (activeChartTab === "shifts") {
      source = clientData.shifts_summary;
    } else {
      if (clientData.departments_breakdown) {
        source = Object.fromEntries(
          Object.entries(clientData.departments_breakdown).map(
            ([deptName, dept]) => [deptName, dept.total_allowance]
          )
        );
      } else {
        source = clientData.department_summary;
      }
    }

    if (!source) return [];

    return Object.entries(source).map(([key, value]) => ({
      name: key,
      amount: Number(value),
    }));
  }, [clientData, activeChartTab]);

  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <img
          src={arrow}
          alt="back"
          style={{ width: 16, height: 16, transform: "rotate(90deg)" }}
          onClick={() => navigate("/")}
        />
        <span>{clientName}</span>
      </h2>

      {/* KPI */}
      <div className="flex flex-wrap gap-4 mb-6">
        <KpiCard
          loading={loading}
          HeaderIcon={allowanceIcon}
          HeaderText="Total Allowance"
          BodyNumber={`₹${Number(
            summary?.total_allowance ?? 0
          ).toLocaleString()}`}
        />

        <KpiCard
          loading={loading}
          HeaderIcon={departmentsIcon}
          HeaderText="Departments"
          BodyNumber={summary?.departments ?? 0}
        />

        <KpiCard
          loading={loading}
          HeaderIcon={peopleIcon}
          HeaderText="Client Partners"
          BodyNumber={Object.keys(normalizedPartners).length}
        />

        <KpiCard
          loading={loading}
          HeaderIcon={peopleIcon}
          HeaderText="Headcount"
          BodyNumber={summary?.headcount ?? 0}
        />
      </div>

      {/* TABLE */}
      <div className="rounded-b-xl bg-white  mb-6">
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

      {/* CHART */}
     <div className="rounded-xl bg-white p-4 ">
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
  );
}
