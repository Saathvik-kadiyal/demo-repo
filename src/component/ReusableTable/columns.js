export const SHIFT_HEADERS = [
  "ANZ",
  "PST_MST",
  "US_IND",
  "SG",
  "US3",
];

const buildShiftColumns = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shifts.${key}`,
    header: key,
    sortable: true,
    sortFn: (a, b) => (a?.shifts?.[key] || 0) - (b?.shifts?.[key] || 0),
    render: (val) => val ?? 0,
  }));

  const buildAllowanceShiftColumns = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shift_days.${key}`,
    header: key,
    sortable: true,
    sortFn: (a, b) => (a?.shifts_days?.[key] || 0) - (b?.shifts_days?.[key] || 0),
    render: (val) =>
      val??0
  }));

export const buildClientSummary = () =>
  SHIFT_HEADERS.map((key) => ({
    key: `shifts.${key}`, // nested path is correct
    header: key,
    sortable: true,
    sortFn: (a, b) => (a.shifts?.[key] || 0) - (b.shifts?.[key] || 0),
    render: (val) => `₹ ${Number(val ?? 0).toLocaleString()}`, // ensure a number, no object
  }));


  export const dashboardColumns = [
  {
    key: "company",
    header: "Client Name",
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "departments",
    header: "Department",
    sortable: true,
    sortFn: (a, b) => (a.department_count || 0) - (b.department_count || 0),
  },
  {
    key: "headcount",
    header: "Headcount",
    sortable: true,
    sortFn: (a, b) => (a.head_count || 0) - (b.head_count || 0),
  },
  {
    key: "total_allowance",
    header: "Allowance",
    sortable: true,
    sortFn: (a, b) => (a.total || 0) - (b.total || 0),
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
  },
 
{
  key: "action",
  header: "Action",
  type: "action"
}

];



export const allowanceColumns = [
  {
    key: "emp_name",
    header: "Emp Name",
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "emp_id",
    header: "ID",
    sortable: true,
  },
  {
    key: "head_count",
    header: "Headcount",
    sortable: true,
    sortFn: (a, b) => a.head_count - b.head_count,
  },
  {
    key: "client_partner",
    header: "Client Partner",
    sortable: true,
  },

  ...buildAllowanceShiftColumns(),

  {
    key: "total",
    header: "TotalAllowance",
    sortable: true,
    sortFn: (a, b) => (a.total || 0) - (b.total || 0),
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
  },
  {
  key: "action",
  header: "Action",
  type: "action"
}
];

export const clientAnalyticsClientColumns = [
  {
    key: "name",
    header: "Client Name",
    sortable: true,
  },
  {
    key: "head_count",
    header: "Headcount",
    sortable: true,
  },

  ...buildClientSummary(),

  {
    key: "total",
    header: "TotalAllowance",
    sortable: true,
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
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
    sortable: true,
  },
  {
    key: "head_count",
    header: "Headcount",
    sortable: true,
  },
  {
    key: "client_partner",
    header: "Client Partner",
    sortable: true,
  },

  ...buildClientSummary(),

  {
    key: "total",
    header: "Total Allowance",
    sortable: true,
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
  },
];


export const clientDetailClientPartnersColumns = [
  {
    key: "name",
    header: "Client Partner Name",
    sortable: true,
  },
  {
    key: "head_count",
    header: "Headcount",
    sortable: true,
  },

  ...buildShiftColumns(),

  {
    key: "total",
    header: "Total Allowance",
    sortable: true,
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
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
    sortable: true,
  },
  {
    key: "emp_id",
    header: "ID",
    sortable: true,
  },
  {
    key: "department",
    header: "Department",
    sortable: true,
  },

  ...buildShiftColumns(),

  {
    key: "total",
    header: "Total Allowance",
    sortable: true,
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
  },
];  