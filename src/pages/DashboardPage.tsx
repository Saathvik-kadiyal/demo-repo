import { useState, useEffect, useCallback, useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import "../index.css"
import {
  debounce,
  fetchClientDepartments,
  fetchClientEnums,
  fetchDashboardClientSummary,
} from "../utils/helper";
import KpiCard from "../component/kpicards/KpiCard";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import ActionButton from "../component/buttons/ActionButton";
import { DashboardResponse } from "../features/dashboard/types";
import type { Column } from "../component/ReusableTable/types";
import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";
import clients from "../assets/clients.svg"



const data =[{
    "2025-12": {
        "clients": {
            "ILC Dover": {
                "client_A": 52000.0,
                "client_B": 0.0,
                "client_C": 200.0,
                "client_PRIME": 13300.0,
                "departments": {
                    "Infra - IT Operations": {
                        "dept_A": 15500.0,
                        "dept_B": 0.0,
                        "dept_C": 200.0,
                        "dept_PRIME": 3500.0,
                        "dept_total": 19200.0,
                        "employees": [
                            {
                                "emp_id": "IN01801194",
                                "emp_name": "Madhusudhan THAMMALA",
                                "account_manager": "Jay Nagaram",
                                "A": 10000.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 10000.0
                            },
                            {
                                "emp_id": "IN01802005",
                                "emp_name": "Umamaheswara Rao  JONNAKUTI",
                                "account_manager": "Jay Nagaram",
                                "A": 5500.0,
                                "B": 0.0,
                                "C": 200.0,
                                "PRIME": 3500.0,
                                "total": 9200.0
                            }
                        ],
                        "dept_head_count": 2
                    },
                    "Advanced Analytics": {
                        "dept_A": 36500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 9800.0,
                        "dept_total": 46300.0,
                        "employees": [
                            {
                                "emp_id": "IN01804122",
                                "emp_name": "Naveen Sanapathi",
                                "account_manager": "Jay Nagaram",
                                "A": 9000.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 7000.0,
                                "total": 16000.0
                            },
                            {
                                "emp_id": "IN01800974",
                                "emp_name": "Swaroop KOPANATHI",
                                "account_manager": "Jay Nagaram",
                                "A": 8500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 8500.0
                            },
                            {
                                "emp_id": "IN01805469",
                                "emp_name": "Obulesu Marriboina",
                                "account_manager": "Jay Nagaram",
                                "A": 9500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 2800.0,
                                "total": 12300.0
                            },
                            {
                                "emp_id": "IN01804752",
                                "emp_name": "Phani Kumar PONNADA",
                                "account_manager": "Jay Nagaram",
                                "A": 9500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 9500.0
                            }
                        ],
                        "dept_head_count": 4
                    }
                },
                "client_head_count": 6,
                "client_total": 65500.0
            },
            "DZS Inc": {
                "client_A": 7000.0,
                "client_B": 0.0,
                "client_C": 0.0,
                "client_PRIME": 2100.0,
                "departments": {
                    "Infra - IT Operations": {
                        "dept_A": 7000.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 2100.0,
                        "dept_total": 9100.0,
                        "employees": [
                            {
                                "emp_id": "IN01800341",
                                "emp_name": "Karthik KONCHADA",
                                "account_manager": "Sunil Pasupuleti",
                                "A": 7000.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 2100.0,
                                "total": 9100.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 1,
                "client_total": 9100.0
            },
            "Vertisystem Inc": {
                "client_A": 17500.0,
                "client_B": 1050.0,
                "client_C": 0.0,
                "client_PRIME": 0.0,
                "departments": {
                    "Infra - IT Operations": {
                        "dept_A": 17500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 17500.0,
                        "employees": [
                            {
                                "emp_id": "IN01804070",
                                "emp_name": "Mahammad Riyaz SHAIK",
                                "account_manager": "Parthasarathy Reddy BOKKA",
                                "A": 9500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 9500.0
                            },
                            {
                                "emp_id": "IN01800119",
                                "emp_name": "Swagath Banda",
                                "account_manager": "Parthasarathy Reddy BOKKA",
                                "A": 8000.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 8000.0
                            }
                        ],
                        "dept_head_count": 2
                    },
                    "IQE": {
                        "dept_A": 0.0,
                        "dept_B": 1050.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 1050.0,
                        "employees": [
                            {
                                "emp_id": "IN01805166",
                                "emp_name": "Savitri KANCHARLA",
                                "account_manager": "Parthasarathy Reddy BOKKA",
                                "A": 0.0,
                                "B": 1050.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 1050.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 3,
                "client_total": 18550.0
            },
            "Clair Source Group": {
                "client_A": 0.0,
                "client_B": 0.0,
                "client_C": 0.0,
                "client_PRIME": 10500.0,
                "departments": {
                    "Infra - IT Operations": {
                        "dept_A": 0.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 10500.0,
                        "dept_total": 10500.0,
                        "employees": [
                            {
                                "emp_id": "IN01801072",
                                "emp_name": "Madhu Pavan Kumar  TELAPROLU",
                                "account_manager": "Siva Dega",
                                "A": 0.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 10500.0,
                                "total": 10500.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 1,
                "client_total": 10500.0
            },
            "LeaseLock Inc": {
                "client_A": 7500.0,
                "client_B": 6650.0,
                "client_C": 0.0,
                "client_PRIME": 700.0,
                "departments": {
                    "Advanced Analytics": {
                        "dept_A": 0.0,
                        "dept_B": 6650.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 6650.0,
                        "employees": [
                            {
                                "emp_id": "IN01801361",
                                "emp_name": "Praneeth Swaroop Varma KOSURI",
                                "account_manager": "Mayuri DARABASTU",
                                "A": 0.0,
                                "B": 6650.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 6650.0
                            }
                        ],
                        "dept_head_count": 1
                    },
                    "BPS": {
                        "dept_A": 7500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 700.0,
                        "dept_total": 8200.0,
                        "employees": [
                            {
                                "emp_id": "IN01802763",
                                "emp_name": "Radha Singh  THAKUR",
                                "account_manager": "Mayuri DARABASTU",
                                "A": 7500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 700.0,
                                "total": 8200.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 2,
                "client_total": 14850.0
            },
            "CHEP USA Inc": {
                "client_A": 5000.0,
                "client_B": 6300.0,
                "client_C": 0.0,
                "client_PRIME": 0.0,
                "departments": {
                    "BPS": {
                        "dept_A": 5000.0,
                        "dept_B": 6300.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 11300.0,
                        "employees": [
                            {
                                "emp_id": "IN01804396",
                                "emp_name": "Monika  GANGAM",
                                "account_manager": "Srinivas Chowtapalli",
                                "A": 5000.0,
                                "B": 2450.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 7450.0
                            },
                            {
                                "emp_id": "IN01804611",
                                "emp_name": "Prudhvi Sai  KANNEPALLI",
                                "account_manager": "Srinivas Chowtapalli",
                                "A": 0.0,
                                "B": 3850.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 3850.0
                            }
                        ],
                        "dept_head_count": 2
                    }
                },
                "client_head_count": 2,
                "client_total": 11300.0
            },
            "MOURI Tech Limited": {
                "client_A": 0.0,
                "client_B": 3500.0,
                "client_C": 0.0,
                "client_PRIME": 0.0,
                "departments": {
                    "Accounts & Finance": {
                        "dept_A": 0.0,
                        "dept_B": 3500.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 3500.0,
                        "employees": [
                            {
                                "emp_id": "IN01800976",
                                "emp_name": "Bala Krishna PANDIKONDA",
                                "account_manager": "Amarnath ANUMANDLA",
                                "A": 0.0,
                                "B": 3500.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 3500.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 1,
                "client_total": 3500.0
            },
            "MOURI Tech LLC": {
                "client_A": 9500.0,
                "client_B": 4550.0,
                "client_C": 0.0,
                "client_PRIME": 0.0,
                "departments": {
                    "Accounts & Finance": {
                        "dept_A": 0.0,
                        "dept_B": 4550.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 4550.0,
                        "employees": [
                            {
                                "emp_id": "IN01804078",
                                "emp_name": "Srikanth  NEERATI",
                                "account_manager": "Amarnath ANUMANDLA",
                                "A": 0.0,
                                "B": 4550.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 4550.0
                            }
                        ],
                        "dept_head_count": 1
                    },
                    "Digital Engineering": {
                        "dept_A": 9500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 9500.0,
                        "employees": [
                            {
                                "emp_id": "IN01801926",
                                "emp_name": "Kartheek Naidu  ALAMURI",
                                "account_manager": "Amit Kulkarni",
                                "A": 9500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 9500.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 2,
                "client_total": 14050.0
            },
            "American Tire Distributors Inc": {
                "client_A": 17000.0,
                "client_B": 0.0,
                "client_C": 0.0,
                "client_PRIME": 0.0,
                "departments": {
                    "IQE": {
                        "dept_A": 7500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 7500.0,
                        "employees": [
                            {
                                "emp_id": "IN01804831",
                                "emp_name": "Raja PAMIDIMUKKALA",
                                "account_manager": "Amit Kulkarni",
                                "A": 7500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 7500.0
                            }
                        ],
                        "dept_head_count": 1
                    },
                    "Digital Engineering": {
                        "dept_A": 9500.0,
                        "dept_B": 0.0,
                        "dept_C": 0.0,
                        "dept_PRIME": 0.0,
                        "dept_total": 9500.0,
                        "employees": [
                            {
                                "emp_id": "IN01801926",
                                "emp_name": "Kartheek Naidu  ALAMURI",
                                "account_manager": "Amit Kulkarni",
                                "A": 9500.0,
                                "B": 0.0,
                                "C": 0.0,
                                "PRIME": 0.0,
                                "total": 9500.0
                            }
                        ],
                        "dept_head_count": 1
                    }
                },
                "client_head_count": 2,
                "client_total": 17000.0
            }
        },
        "month_total": {
            "total_head_count": 20,
            "A": 115500.0,
            "B": 22050.0,
            "C": 200.0,
            "PRIME": 26600.0,
            "total_allowance": 164350.0
        }
    }
}]

const tableData = Object.entries(data[0]["2025-12"].clients).map(
  ([clientName, client]: any) => ({
    clientName,
    client_A: client.client_A,
    client_B: client.client_B,
    client_C: client.client_C,
    client_PRIME: client.client_PRIME,
    client_total: client.client_total,
    client_head_count: client.client_head_count,
  })
);

const columns: Column<{
  clientName: any;
  client_A: any;
  client_B: any;
  client_C: any;
  client_PRIME: any;
  client_total: any;
  client_head_count: any;
}>[] = [
  { key: "clientName", header: "Client", width:"200px" },
  { key: "client_head_count", header: "HC",  },
  { key: "client_A", header: "A", },
  { key: "client_B", header: "B", },
  { key: "client_C", header: "C",  },
  { key: "client_PRIME", header: "PRIME", },
  { key: "client_total", header: "Total",  },
];




type ClientDepartments = {
  client: string;
  departments: string[];
};

type SelectedClientsMap = Record<string, string[]>;

const hideScrollbar = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    width: 0,
    height: 0,
    background: "transparent",
  },
};

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardResponse | null>(null);

  const [selectedClients, setSelectedClients] =
    useState<SelectedClientsMap>({});

  const [clientDepartments, setClientDepartments] =
    useState<ClientDepartments[]>([]);

  const [clientDialogOpen, setClientDialogOpen] = useState<boolean>(false);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const [startMonth, setStartMonth] = useState<Dayjs | null>(null);
  const [endMonth, setEndMonth] = useState<Dayjs | null>(null);

  const [topFilter, setTopFilter] = useState<string>("5");
  const [timelineSelection, setTimelineSelection] =
    useState<"monthly" | "quarterly" | "range">("range");

  const [year, setYear] = useState<Dayjs | null>(null);
  const [multipleMonths, setMultipleMonths] = useState<string[]>([]);
  const [quarterlySelection, setQuarterlySelection] = useState<string[]>([]);

  const [transformedData, setTransformedData] =
    useState<Record<string, unknown>>({});

  const [selectedDonutClient, setSelectedDonutClient] =
    useState<string | null>(null);

  const [accountManager, setAccountManager] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [selectedColor, setSelectedColor] = useState<string>("");
  const [clientColors, setClientColors] =
    useState<Record<string, string>>({});

  const [enums, setEnums] = useState<Record<string, unknown> | null>(null);

  const horizontalChartData = useMemo(() => {
    if (!data?.dashboard?.clients) return null;

    return Object.fromEntries(
      Object.entries(data.dashboard.clients).map(
        ([client, clientData]) => [
          client,
          {
            total_allowance: clientData.total_allowance,
            color: clientColors[client],
            shift_A: clientData.shift_A,
            shift_B: clientData.shift_B,
            shift_C: clientData.shift_C,
            shift_PRIME: clientData.shift_PRIME,
          },
        ]
      )
    );
  }, [data, clientColors]);

  const isEndMonthInvalid =
    !!startMonth &&
    !!endMonth &&
    (dayjs(endMonth).isBefore(dayjs(startMonth), "month") ||
      dayjs(endMonth).isSame(dayjs(startMonth), "month"));

  const isStartMonthInvalid = !startMonth && !!endMonth;

  /* ---------------- Constants ---------------- */

  const timelines = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Range", value: "range" },
  ] as const;

  const monthsList = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  const quarterlyList = [
    { label: "Q1 (Jan - Mar)", value: "Q1" },
    { label: "Q2 (Apr - Jun)", value: "Q2" },
    { label: "Q3 (Jul - Sep)", value: "Q3" },
    { label: "Q4 (Oct - Dec)", value: "Q4" },
  ];

  const runFetch = useCallback(
    debounce(async (payload: Record<string, unknown>) => {
      setLoading(true);
      setError("");

      try {
        const res: DashboardResponse =
          await fetchDashboardClientSummary(payload);
        setData(res);
      } catch (err: any) {
        setError(err?.message ?? "Unable to fetch data");
        setData(null);
      } finally {
        setLoading(false);
      }
    }, 600),
    []
  );

  const runClientEnums = useCallback(async () => {
    try {
      const response = await fetchClientEnums();
      setEnums(response);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch enums");
    }
  }, []);

  useEffect(() => {
    runFetch({ clients: "ALL", top: topFilter });
    runClientEnums();
  }, []);

  useEffect(() => {
    if (!data?.dashboard) return;

    setTransformedData({});
    setAccountManager([]);
  }, [data]);

  useEffect(() => {
    const loadClientDepartments = async () => {
      try {
        setLoading(true);
        const res: ClientDepartments[] =
          await fetchClientDepartments();
        setClientDepartments(res);
      } catch (err: any) {
        setError(err?.message ?? "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };

    loadClientDepartments();
  }, []);

  useEffect(() => {
    setEndMonth(null);
    setStartMonth(null);
    setYear(null);
    setQuarterlySelection([]);
    setMultipleMonths([]);
  }, [timelineSelection]);

  const toggleDepartment = (client: string, dept: string) => {
    setSelectedClients((prev) => {
      const current = prev[client] || [];

      if (dept === "ALL") {
        const allDepartments =
          clientDepartments.find((c) => c.client === client)
            ?.departments || [];

        if (current.length === allDepartments.length) {
          const { [client]: _, ...rest } = prev;
          return rest;
        }

        return { ...prev, [client]: allDepartments };
      }

      const updated = current.includes(dept)
        ? current.filter((d) => d !== dept)
        : [...current, dept];

      if (!updated.length) {
        const { [client]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [client]: updated };
    });
  };

  const handleUpload = () => {
    console.log("Upload clicked");
  };

  return (
    <div
      className={`
        relative w-full justify-center px-4 py-4 overflow-x-hidden
        ${clientDialogOpen ? "overflow-y-hidden h-full" : "overflow-y-auto h-auto"}
      `}
    >
      <div className="flex flex-wrap gap-4">
        <KpiCard
          loading
          HeaderIcon={clients}
          HeaderText="Total Clients"
          BodyNumber="09"
          BodyComparisionNumber="4% decrease from last month"
        />
        <ShiftKpiCard
        loading={false} ShiftType={"USA"} ShiftCount={20} ShiftCountry={"USA/IND"} ShiftCountSize={"2rem"} ShiftTypeSize={"2rem"} />

      </div>
      
      <ActionButton
        content={() => (
          <button className="actionBtn" role="button" onClick={handleUpload}>
            <span>+</span>
            <p>Upload File</p>
          </button>
        )}
      />

      <div className="w-[60%] rounded-xl py-4 overflow-hidden bg-white">
<ReusableTable
  data={tableData}
  columns={columns}
  wrapperStyle={{}}
  cellStyle={{ fontSize: 13 }}
/>
      </div>


      

    </div>
  );
};

export default DashboardPage;
