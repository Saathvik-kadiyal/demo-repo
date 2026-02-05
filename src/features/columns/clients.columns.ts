import { Column } from "../../component/ReusableTable/types";
import { departmentColumns } from "./department.columns";

export const clientColumns: Column<any>[] = [
  { key: "clientName", header: "Client" },
  { key: "client_A", header: "A", align: "right" },
  { key: "client_B", header: "B", align: "right" },
  { key: "client_C", header: "C", align: "right" },
  { key: "client_PRIME", header: "PRIME", align: "right" },
  { key: "client_total", header: "Total", align: "right" },
  { key: "client_head_count", header: "HC", align: "right" },
  {
    key: "departments",
    header: "Departments",
    render: (value) => `${Object.keys(value).length} depts`,
    nestedColumns: departmentColumns,
    nestedKeyField: "deptName",    
  },
];

