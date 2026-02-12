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
    normalizeEntity(emp.name || "Employee", emp, "employee", `emp-${i}`)
  );
}

function normalizeDepartments(deptsObj) {
  if (!deptsObj) return [];

  // if it's numeric count → no nesting possible
  if (typeof deptsObj === "number") return [];

  if (typeof deptsObj !== "object") return [];

  return Object.entries(deptsObj).map(([deptName, deptData]) => {
    const deptRow = normalizeEntity(deptName, deptData, "department", `dept-${deptName}`);

    const empRows = normalizeEmployees(deptData?.employees);
    if (empRows.length) deptRow.children = empRows;

    return deptRow;
  });
}

function normalizeClients(clientsObj) {
  if (!clientsObj || typeof clientsObj !== "object") return [];

  return Object.entries(clientsObj).map(([clientName, clientData]) => {
    const clientRow = normalizeEntity(clientName, clientData, "client", `client-${clientName}`);

    const deptRows = normalizeDepartments(clientData?.departments);
    if (deptRows.length) clientRow.children = deptRows;

    return clientRow;
  });
}

function normalizePartners(partnersObj) {
  if (!partnersObj || typeof partnersObj !== "object") return [];

  return Object.entries(partnersObj).map(([partnerName, partnerData]) => {
    const partnerRow = normalizeEntity(partnerName, partnerData, "partner", `partner-${partnerName}`);

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
  if (dashboard.client_partner) return normalizePartners(dashboard.client_partner);
  if (dashboard.departments) return normalizeDepartments(dashboard.departments);
  if (dashboard.employees) return normalizeEmployees(dashboard.employees);

  return [];
}

export function normalizeDashboardData(raw) {
  if (!raw) return [];

return Object.entries(raw.dashboard.clients).map(([clientName, data]) => {
  return {
    type: "client",
    name: clientName,
   department_count: data?.departments
  ? Object.keys(data.departments).length
  : 0,

   head_count: data?.head_count,
  total: data?.total_allowance ?? 0
  };
});

}
