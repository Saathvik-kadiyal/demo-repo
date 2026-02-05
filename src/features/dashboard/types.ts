export type ShiftCounts = {
  shift_A: number;
  shift_B: number;
  shift_C: number;
  shift_PRIME: number;
};

export type DepartmentData = ShiftCounts & {
  total_allowance: number;
  head_count: number;
};

export type ClientDepartmentMap = Record<string, DepartmentData>;

export type ClientDashboardData = ShiftCounts & {
  total_allowance: number;
  department: ClientDepartmentMap;
};

export type DashboardResponse = {
  dashboard: {
    clients: Record<string, ClientDashboardData>;
    account_manager: Record<string, any>;
  };
};
