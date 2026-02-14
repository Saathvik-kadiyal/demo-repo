export const normalizeFilters = (filters = {}) => {
  const payload = {
    clients: filters.clients || "ALL",
    departments: filters.departments || "ALL",
    shifts: filters.shifts || "ALL",
    headcounts: filters.headcounts || "ALL",
    sort_by: filters.sort_by || "total_allowance",
    sort_order: filters.sort_order || "default",
  };

  /* -------------------------
     Years
  ------------------------- */
  if (Array.isArray(filters.years) && filters.years.length > 0) {
    payload.years = filters.years
      .map(Number)
      .filter((y) => Number.isInteger(y));
  }

  /* -------------------------
     Months
  ------------------------- */
  if (Array.isArray(filters.months) && filters.months.length > 0) {
    payload.months = filters.months
      .map(Number)
      .filter((m) => m >= 1 && m <= 12);
  }

  /* -------------------------
     OPTIONAL / EXTRA KEYS
     (pass-through safely)
  ------------------------- */
  if (filters.emp_id) {
    payload.emp_id = Array.isArray(filters.emp_id)
      ? filters.emp_id
      : [filters.emp_id];
  }

  if (filters.client_partner) {
    payload.client_partner = Array.isArray(filters.client_partner)
      ? filters.client_partner
      : [filters.client_partner];
  }

  return payload;
};
