import { Column } from "../../component/ReusableTable/types";
import { employeeColumns } from "./employee.columns";

export const departmentColumns: Column<any>[] = [
  { key: "deptName", header: "Department" },
  { key: "dept_A", header: "A", align: "right" },
  { key: "dept_B", header: "B", align: "right" },
  { key: "dept_C", header: "C", align: "right" },
  { key: "dept_PRIME", header: "PRIME", align: "right" },
  { key: "dept_total", header: "Total", align: "right" },
  { key: "dept_head_count", header: "HC", align: "right" },
  {
    key: "employees",
    header: "Employees",
    render: (value) => `${value.length} employees`,
    nestedColumns: employeeColumns,
  },
];

