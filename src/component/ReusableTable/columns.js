export const SHIFT_HEADERS = [
  "SG",
  "UK",
  "IND",
  "US1",
  "US2",
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


  export const dashboardColumns = [
  {
    key: "name",
    header: "Client Name",
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: "department_count",
    header: "Department",
    sortable: true,
    sortFn: (a, b) => (a.department_count || 0) - (b.department_count || 0),
  },
  {
    key: "head_count",
    header: "Headcount",
    sortable: true,
    sortFn: (a, b) => (a.head_count || 0) - (b.head_count || 0),
  },
  {
    key: "total",
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
    key: "name",
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

  ...buildShiftColumns(),

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

  ...buildShiftColumns(),

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

  ...buildShiftColumns(),

  {
    key: "total",
    header: "Total Allowance",
    sortable: true,
    render: (v) => `₹ ${Number(v).toLocaleString()}`,
  },
];
