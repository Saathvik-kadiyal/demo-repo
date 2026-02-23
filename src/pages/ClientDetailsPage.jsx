import { useEffect, useState, useCallback, useMemo } from "react";
import "../index.css";
import allowanceIcon from "../assets/allowance.svg";
import departmentsIcon from "../assets/departments.svg";
import clientsIcon from "../assets/clients.svg"
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
import {
  fetchDashboardIndividualClientDetails,
  fetchDashboardIndividualDepartmentDetails,
} from "../utils/helper";
import {
  clientDetailClientPartnersColumns,
  clientDetailEmployeesColumns,
} from "../component/ReusableTable/columns";
import { formatRupeesWithUnit } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";

const buildPayload = ({ clientName, departmentName, years, months }) => {
  const payload = {};

  if (clientName){
     payload.clients = clientName;
  }else if (departmentName) payload.departments = departmentName;
  if (years?.length) payload.years = years;
  if (months?.length) payload.months = months;

  return payload;
};

export default function ClientDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    clientName = "",
    departmentName = "",
    years = [],
    months = [],
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState("shifts");

  /* -------------------------
     FETCH DETAILS
  ------------------------- */
  const fetchDetails = useCallback(async () => {
    if (!clientName && !departmentName) return;

    try {
      setLoading(true);

      const payload = buildPayload({
        clientName,
        departmentName,
        years,
        months,
      });

      let res;

      if (clientName) {
        res = await fetchDashboardIndividualClientDetails(payload);
        setClientData(res?.clients?.[clientName] ?? null);
      } else {
        res = await fetchDashboardIndividualDepartmentDetails(payload);
        setClientData(res?.departments?.[departmentName] ?? null);
      }

      setSummary(res?.summary ?? null);
    } catch (err) {
      console.error("Details error:", err);
      setSummary(null);
      setClientData(null);
    } finally {
      setLoading(false);
    }
  }, [clientName, departmentName, years, months]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  /* -------------------------
     NORMALIZED PARTNERS COUNT
  ------------------------- */
  const normalizedPartners = useMemo(() => {
    if (!clientData) return {};

    // Department flow
    if (departmentName && clientData.clients_breakdown) {
      return Object.values(clientData.clients_breakdown).reduce(
        (acc, client) => {
          Object.entries(client.client_partners || {}).forEach(
            ([partnerName, partner]) => {
              if (!acc[partnerName]) {
                acc[partnerName] = partner;
              }
            }
          );
          return acc;
        },
        {}
      );
    }

    // Client flow
    if (clientData.departments_breakdown) {
      return Object.values(clientData.departments_breakdown).reduce(
        (acc, dept) => {
          Object.entries(dept.client_partners || {}).forEach(
            ([partnerName, partner]) => {
              if (!acc[partnerName]) {
                acc[partnerName] = partner;
              }
            }
          );
          return acc;
        },
        {}
      );
    }

    return {};
  }, [clientData, departmentName]);

  /* -------------------------
     TABLE DATA
  ------------------------- */
  const tableData = useMemo(() => {
    if (!clientData) return [];
    if (departmentName && clientData.clients_breakdown) {
      return Object.entries(clientData.clients_breakdown).map(
        ([client, clientObj]) => ({
          type: "client",
          name: client,
          head_count: clientObj.headcount ?? 0,
          total: clientObj.total_allowance ?? 0,

          shifts: {
            ANZ: formatRupeesWithUnit(clientObj.shifts_summary?.ANZ || 0),
            PST_MST: formatRupeesWithUnit(
              clientObj.shifts_summary?.PST_MST || 0
            ),
            US_INDIA: formatRupeesWithUnit(
              clientObj.shifts_summary?.US_INDIA || 0
            ),
            SG: formatRupeesWithUnit(clientObj.shifts_summary?.SG || 0),
          },

          children: Object.entries(clientObj.client_partners || {}).map(
            ([partnerName, partner]) => ({
              type: "partner",
              name: partnerName,
              head_count: partner.headcount ?? 0,
              total: partner.total_allowance ?? 0,

              shifts: {
                ANZ: formatRupeesWithUnit(partner.shifts_summary?.ANZ || 0),
                PST_MST: formatRupeesWithUnit(
                  partner.shifts_summary?.PST_MST || 0
                ),
                US_INDIA: formatRupeesWithUnit(
                  partner.shifts_summary?.US_INDIA || 0
                ),
                SG: formatRupeesWithUnit(partner.shifts_summary?.SG || 0),
              },

              children: (partner.employees || []).map((emp) => ({
                type: "employee",
                name: emp.emp_name,
                emp_id: emp.emp_id,
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
    }

    // 🔵 Client Flow
    if (clientData.departments_breakdown) {
      return Object.entries(clientData.departments_breakdown).map(
        ([deptName, dept]) => ({
          type: "department",
          name: deptName,
          head_count: dept.headcount ?? 0,
          total: dept.total_allowance ?? 0,

          shifts: {
            ANZ: formatRupeesWithUnit(dept.shifts_summary?.ANZ || 0),
            PST_MST: formatRupeesWithUnit(dept.shifts_summary?.PST_MST || 0),
            US_INDIA: formatRupeesWithUnit(
              dept.shifts_summary?.US_INDIA || 0
            ),
            SG: formatRupeesWithUnit(dept.shifts_summary?.SG || 0),
          },

          children: Object.entries(dept.client_partners || {}).map(
            ([partnerName, partner]) => ({
              type: "partner",
              name: partnerName,
              head_count: partner.headcount ?? 0,
              total: partner.total_allowance ?? 0,

              shifts: {
                ANZ: formatRupeesWithUnit(partner.shifts_summary?.ANZ || 0),
                PST_MST: formatRupeesWithUnit(
                  partner.shifts_summary?.PST_MST || 0
                ),
                US_INDIA: formatRupeesWithUnit(
                  partner.shifts_summary?.US_INDIA || 0
                ),
                SG: formatRupeesWithUnit(partner.shifts_summary?.SG || 0),
              },

              children: (partner.employees || []).map((emp) => ({
                type: "employee",
                name: emp.emp_name,
                emp_id: emp.emp_id,
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
    }

    return [];
  }, [clientData, departmentName]);

  /* -------------------------
     CHART DATA
  ------------------------- */
  const chartData = useMemo(() => {
    if (!clientData) return [];

    let source = null;

    if (activeChartTab === "shifts") {
      source = clientData.shifts_summary;
    } else {
      if (departmentName && clientData.clients_breakdown) {
        source = Object.fromEntries(
          Object.entries(clientData.clients_breakdown).map(
            ([client, obj]) => [client, obj.total_allowance]
          )
        );
      } else if (clientData.departments_breakdown) {
        source = Object.fromEntries(
          Object.entries(clientData.departments_breakdown).map(
            ([dept, obj]) => [dept, obj.total_allowance]
          )
        );
      }
    }

    if (!source) return [];

    return Object.entries(source).map(([key, value]) => ({
      name: key,
      amount: Number(value),
    }));
  }, [clientData, departmentName, activeChartTab]);

  return (
    <div className="relative w-full px-4 py-4 overflow-x-hidden">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <img
          src={arrow}
          alt="back"
          style={{ width: 16, height: 16, transform: "rotate(90deg)" }}
          onClick={() => navigate("/")}
        />
        <span>{clientName || departmentName}</span>
      </h2>

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
  HeaderIcon={summary?.clients ? clientsIcon : departmentsIcon}
  HeaderText={summary?.clients ? "Clients" : "Departments"}
  BodyNumber={summary?.clients ? summary?.clients : summary?.total_departments}
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

      <div className="rounded-xl bg-white p-4 ">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium">
            {activeChartTab === "shifts"
              ? "Shift Allowance Distribution"
              : "Allowance Distribution"}
          </p>

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
              {departmentName ? "Clients" : "Departments"}
            </button>
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barCategoryGap="40%">
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
                fill="#15549D"
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