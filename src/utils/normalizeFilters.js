// utils/normalizeFilters.js
export const normalizeFilters = (filters = {}) => {
  console.log("NORMALIZING FILTERS:", filters);
  const payload = {
    clients: filters.clients || "ALL",
    departments: filters.departments || "ALL",
    sort_by: "total_allowance",
    sort_order: "default",
  };

  // YEARS
  if (Array.isArray(filters.years) && filters.years.length > 0) {
    const years = filters.years
      .map(Number)
      .filter((y) => Number.isInteger(y) && y >= 2000);
    if (years.length > 0) payload.years = years;
  }

  // MONTHS
  if (Array.isArray(filters.months) && filters.months.length > 0) {
    const months = filters.months.map(Number).filter((m) => m >= 1 && m <= 12);
    if (months.length > 0) payload.months = months;
  }

  // HEADCOUNT
  if (filters.headcount && filters.headcount !== "ALL") {
    payload.headcount = filters.headcount;
  }

  // TOP
  if (filters.top && filters.top !== "ALL") {
    payload.top = filters.top;
  }

  // ALLOWANCE RANGE (optional)
  if (filters.allowance && filters.allowance.length > 0) {
    payload.allowance = filters.allowance;
  }

  return payload;
};
