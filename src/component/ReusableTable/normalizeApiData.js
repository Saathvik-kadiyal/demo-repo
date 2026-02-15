function extractShifts(obj) {
  const shifts = {};
  if (!obj || typeof obj !== "object") return shifts;

  Object.entries(obj).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      "total" in value &&
      "head_count" in value
    ) {
      shifts[key] = value.total ?? 0;
    }
  });

  return shifts;
}

function normalizeEntity(name, data, type, id) {
  return {
    id,
    type,
    name,
    shifts: extractShifts(data),
    total: data?.total_allowance ?? data?.total ?? 0,
    head_count: data?.head_count ?? 0,
  };
}

function normalizeEmployees(employees) {
  if (!Array.isArray(employees)) return [];

  return employees.map((emp, i) =>
    normalizeEntity(emp.name || "Employee", emp, "employee", `emp-${i}`),
  );
}

function normalizeDepartments(deptsObj) {
  if (!deptsObj) return [];

  // if it's numeric count → no nesting possible
  if (typeof deptsObj === "number") return [];

  if (typeof deptsObj !== "object") return [];

  return Object.entries(deptsObj).map(([deptName, deptData]) => {
    const deptRow = normalizeEntity(
      deptName,
      deptData,
      "department",
      `dept-${deptName}`,
    );

    const empRows = normalizeEmployees(deptData?.employees);
    if (empRows.length) deptRow.children = empRows;

    return deptRow;
  });
}

function normalizeClients(clientsObj) {
  if (!clientsObj || typeof clientsObj !== "object") return [];

  return Object.entries(clientsObj).map(([clientName, clientData]) => {
    const clientRow = normalizeEntity(
      clientName,
      clientData,
      "client",
      `client-${clientName}`,
    );

    const deptRows = normalizeDepartments(clientData?.departments);
    if (deptRows.length) clientRow.children = deptRows;

    return clientRow;
  });
}

function normalizePartners(partnersObj) {
  if (!partnersObj || typeof partnersObj !== "object") return [];

  return Object.entries(partnersObj).map(([partnerName, partnerData]) => {
    const partnerRow = normalizeEntity(
      partnerName,
      partnerData,
      "partner",
      `partner-${partnerName}`,
    );

    const clientRows = normalizeClients(partnerData?.clients);
    if (clientRows.length) partnerRow.children = clientRows;

    return partnerRow;
  });
}

export function normalizeApiData(rawData) {
  if (!rawData || typeof rawData !== "object") return [];

  const dashboard = rawData.dashboard;
  if (!dashboard) return [];

  if (dashboard.clients) return normalizeClients(dashboard.clients);
  if (dashboard.client_partner)
    return normalizePartners(dashboard.client_partner);
  if (dashboard.departments) return normalizeDepartments(dashboard.departments);
  if (dashboard.employees) return normalizeEmployees(dashboard.employees);

  return [];
}

export function normalizeDashboardData(raw) {
  if (!raw) return [];
  if (!raw.dashboard || !raw.dashboard.clients) return [];
  return Object.entries(raw.dashboard.clients).map(([clientName, data]) => {
    return {
      type: "client",
      name: clientName,
      department_count: data?.departments
        ? Object.keys(data.departments).length
        : 0,
      head_count: data?.head_count,
      total: data?.total_allowance ?? 0,
    };
  });
}
/**
 * Normalizer for the Client Summary Detailed Page.
 *
 * The API shape for that page is:
 * {
 *   "2025-12": {
 *     clients: {
 *       "Client Name": {
 *         client_head_count,
 *         client_total,
 *         departments: { ... }
 *       },
 *       ...
 *     },
 *     month_total: { ... }
 *   },
 *   "2026-01": { ... }
 * }
 *
 * This helper converts either:
 *  - the full response object (with month keys), or
 *  - a single month object ({ clients, month_total })
 * into a flat array of client rows compatible with `dashboardColumns`.
 */
export function normalizeClientSummaryData(raw) {
  if (!raw || typeof raw !== "object") return [];

  let monthObj = raw;

  if (!monthObj.clients && !monthObj.month_total) {
    const monthKey = Object.keys(raw).find((k) => raw[k]?.clients);
    if (!monthKey) return [];
    monthObj = raw[monthKey] || {};
  }

  const clientsObj = monthObj.clients || {};

  const buildShifts = (obj) => {
    if (!obj || typeof obj !== "object") return {};
    const get = (keys) =>
      keys.reduce(
        (val, key) => (val !== undefined ? val : obj[key]),
        undefined,
      );
    return {
      SG: Number(get(["client_SG", "dept_SG", "SG"])) || 0,
      US_IND:
        Number(get(["client_US_IND", "dept_US_IND", "US_IND"])) || 0,
      PST_MST: Number(get(["client_PST_MST", "dept_PST_MST", "PST_MST"])) || 0,
      ANZ: Number(get(["client_ANZ", "dept_ANZ", "ANZ"])) || 0,
      US3: Number(get(["client_US3", "dept_US3", "US3"])) || 0,
    };
  };

  return Object.entries(clientsObj).map(([clientName, clientData]) => {
    const clientRow = {
      type: "client",
      name: clientName,
      department_count: clientData?.departments
        ? Object.keys(clientData.departments).length
        : 0,
      head_count: clientData?.client_head_count ?? 0,
      total: clientData?.client_total ?? 0,
      shifts: buildShifts(clientData),
      children: [], // always initialize as array
    };

    const departments = clientData.departments || {};

    clientRow.children = Object.entries(departments).map(
      ([deptName, deptData]) => {
        const deptRow = {
          type: "department",
          name: deptName,
          head_count: deptData?.dept_head_count ?? 0,
          total: deptData?.dept_total ?? 0,
          shifts: buildShifts(deptData),
          children: [], // always initialize as array
        };

        deptRow.children = (deptData.employees || []).map((emp, index) => ({
          type: "employee",
          name: emp.emp_name || `Employee ${index + 1}`,
          emp_id: emp.emp_id,
          head_count: 1,
          total: emp.total ?? 0,
          client_partner: emp.client_partner,
          shifts: buildShifts(emp),
          children: [], // employees have no children, but safe to add empty array
        }));

        return deptRow;
      },
    );

    return clientRow;
  });
}

export const mapEmployeeForTable = (employees = []) => {
  if (!Array.isArray(employees)) return [];

  return employees.map((emp) => {
    const shiftDays = emp["Shift Days"] || {}; // your API field for days
    const flattenedShifts = {};
    console.log("Mapping employee:", emp);
    return {
      emp_id: emp["Emp ID"],
      emp_name: emp["Emp Name"],
      department: emp["Department"],
      client_partner: emp["Client Partner"],
      client: emp["Client"],
      duration_month: emp["Duration Month"],
      payroll_month: emp["Payroll Month"],
      shift_days: emp["Shift Details"] || {}, // optional if you still need money
      total: emp["Total Allowances"] ?? 0,
    };
  });
};

export const mapSummaryForCards = (response) => {
  console.log("Mapping summary for cards with response:", response);
  const summary = response?.shift_details || {};

  return {
    headcount: summary.headcount || 0,
    total_allowance: summary.total_allowance || 0,
    shifts: Object.entries(summary).filter(
      ([key]) => key !== "headcount" && key !== "total_allowance",
    ),
  };
};
