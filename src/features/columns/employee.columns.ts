import { Column } from "../../component/ReusableTable/types";

export const employeeColumns: Column<any>[] = [
  { key: "emp_id", header: "Emp ID" },
  { key: "emp_name", header: "Employee Name" },
  { key: "account_manager", header: "Account Manager" },
  { key: "A", header: "A", align: "right" },
  { key: "B", header: "B", align: "right" },
  { key: "C", header: "C", align: "right" },
  { key: "PRIME", header: "PRIME", align: "right" },
  { key: "total", header: "Total", align: "right" },
];
