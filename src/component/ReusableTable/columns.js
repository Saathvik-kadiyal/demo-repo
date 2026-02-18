import { formatRupeesWithUnit } from "../../utils/utils";

export const SHIFT_HEADERS = ["ANZ", "PST_MST", "US_INDIA", "SG"];

const buildShiftColumns = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shifts.${key}`,
    header: key,
    // sortable: true,
    sortFn: (a, b) => (a?.shifts?.[key] || 0) - (b?.shifts?.[key] || 0),
    render: (val) => val ?? 0,
  }));

const buildAllowanceShiftColumns = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shift_days.${key}`,
    header: key,
    // sortable: true,
    sortFn: (a, b) =>
      (a?.shifts_days?.[key] || 0) - (b?.shifts_days?.[key] || 0),
    render: (val) => val ?? 0,
  }));

export const buildClientSummary = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shifts.${key}`,
    header: key,
    // sortable: true,
    sortFn: (a, b) => (a.shifts?.[key] || 0) - (b.shifts?.[key] || 0),
    render: (val) => `${val?formatRupeesWithUnit(val):0}`,
  }));

export const dashboardColumns = [
  {
    key: "company",
    header: "Client Name",
    // sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "departments",
    header: "Department",
    // sortable: true,
    sortFn: (a, b) => (a.department_count || 0) - (b.department_count || 0),
  },
  {
    key: "headcount",
    header: "Headcount",
    // sortable: true,
    sortFn: (a, b) => (a.headcount || 0) - (b.headcount || 0),
    render: (v, row) => row.headcount ?? 1,
  },
  {
    key: "total_allowance",
    header: "Allowance",
    // sortable: true,
    sortFn: (a, b) => (a.total || 0) - (b.total || 0),
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },

  {
    key: "action",
    header: "Action",
    type: "action",
  },
];

export const allowanceColumns = [
  {
    key: "emp_name",
    header: "Emp Name",
    // sortable: true,
    sortFn: (a, b) => a.emp_name.localeCompare(b.emp_name),
  },
  {
    key: "emp_id",
    header: "ID",
    // sortable: true,
  },
  {
    key: "department",
    header: "Department",
    // sortable: true,
  },

  {
    key: "shift_details",
    header: "Shift Details",
    render: (_, row) => {
      const shifts = row?.shift_days || {};

      return Object.entries(shifts)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => `${key} - ${value}`)
        .join(", ");
    },
  },

  {
    key: "client_partner",
    header: "Client Partner",
    // sortable: true,
  },
  {
    key: "client",
    header: "Client",
    // sortable: true,
  },
  {
    key: "duration_month",
    header: "Duration Month",
  },
  {
    key: "payroll_month",
    header: "Payroll Month",
  },
  {
    key: "total",
    header: "Total Allowance",
    // sortable: true,
    sortFn: (a, b) => (a.total || 0) - (b.total || 0),
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },
  {
    key: "action",
    header: "Action",
    type: "action",
  },
];



export const clientAnalyticsClientColumns = [
  {
    key: "name",
    header: "Client Name",
    // sortable: true,
    width:"300px",
  },
  {
    key: "head_count",
    header: "Headcount",
    // sortable: true,
  },

  ...buildClientSummary(),

  {
    key: "total",
    header: "TotalAllowance",
      sortable: true,
    sortKey: "total_allowance",
    render: (v) => `${formatRupeesWithUnit(v)}`,
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },
  {
    key: "action",
    header: "Action",
    type: "action",
  },
];

export const clientAnalyticsEmployeeColumns = [
  {
    key: "name",
    header: "Emp Name",
    // sortable: true,
    width:"300px"
  },
  {
    key: "head_count",
    header: "Headcount",
    // sortable: true,
  },
  {
    key: "client_partner",
    header: "Client Partner",
    // sortable: true,
  },

  ...buildClientSummary(),

  {
    key: "total",
    header: "Total Allowance",
    // sortable: true,
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },
];

export const clientDetailClientPartnersColumns = [
  {
    key: "name",
    header: "Client Partner Name",
    // sortable: true,
  },
  {
    key: "head_count",
    header: "Headcount",
    // sortable: true,
  },

  ...buildShiftColumns(),

  {
    key: "total",
    header: "Total Allowance",
    // sortable: true,
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },
  {
    key: "action",
    header: "Action",
    type: "action",
  },
];

export const clientDetailEmployeesColumns = [
  {
    key: "name",
    header: "Emp Name",
    // sortable: true,
  },
  {
    key: "emp_id",
    header: "ID",
    // sortable: true,
  },
  {
    key: "department",
    header: "Department",
    // sortable: true,
  },

  ...buildShiftColumns(),

  {
    key: "total",
    header: "Total Allowance",
    // sortable: true,
    render: (v) => `${formatRupeesWithUnit(v)}`,
  },
];
