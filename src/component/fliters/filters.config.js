import ClientPanel from "./panels/ClientPanel";
import EmployeeIdPanel from "./panels/EmployeeIdPanel";
import AllowancePanel from "./panels/AllowancePanel";
import DepartmentsPanel from "./panels/DepartmentsPanel";
import HeadcountsPanel from "./panels/HeadCountsPanel.jsx";
import PeriodPanel from "./panels/PeriodPanel.jsx";

export const filterTabs = [
  { key: "client", label: "Client", component: ClientPanel },
  { key: "period", label: "Period", component: PeriodPanel },
  // { key: "employeeId", label: "Employee ID", component: EmployeeIdPanel },
  // { key: "allowance", label: "Allowance", component: AllowancePanel },
  { key: "departments", label: "Departments", component: DepartmentsPanel },
  { key: "headcounts", label: "Headcounts", component: HeadcountsPanel }
];