import React, { useEffect, useState } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import Pagination from "@mui/material/Pagination";
import { FormHelperText } from "@mui/material";
import { CircularProgress } from "@mui/material";
import {
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { formatRupees } from "../utils/utils";

import {
  IconButton,
  Portal,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { X, Eye, Info } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import EmployeeModal from "./EmployeModel.jsx";
import { useEmployeeData } from "../hooks/useEmployeeData.jsx";
import DynamicSearchSelector from "./DynamicSearchSelector.jsx";
import TimeRangeSelector from "./TimeRangeSelector.jsx";

const today = dayjs();
const currentYear = today.year();
const currentMonth = today.month() + 1; // 1–12

const FILTER_WIDTH = 150;
const FILTER_HEIGHT = 40;

const datePickerTextFieldProps = {
  size: "small",
  sx: {
    width: FILTER_WIDTH,
    height: FILTER_HEIGHT,
  },
};

const selectSx = {
  width: FILTER_WIDTH,
  height: FILTER_HEIGHT,
  "& .MuiOutlinedInput-root": {
    height: FILTER_HEIGHT,
    paddingRight: "32px",
  },
};

const formatMonth = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[Number(month) - 1]} - ${year}`;
};

const formatShiftDetails = (value) => {
  if (!value) return "";
  return Object.entries(value)
    .map(([shift, count]) => {
      const cleanShift = shift.replace(/\s*\(.*?\)/, "");
      return `${cleanShift}- ${count}`;
    })
    .join(", ");
};

const formatINR = (value) => {
  if (value == null || isNaN(value)) return "₹ 0.00";
  return `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const DataTable = ({ headers, setTableLoading }) => {
  const {
    modelOpen,
    setModelOpen,
    selectedEmployee,
    loadingDetail,
    error,
    page,
    totalPages,
    loading,
    displayRows,
    debouncedFetch,
    handlePageChange,
    handleIndividualEmployee,
    getProcessedData,
    downloadSearchData,
    shiftSummary,
  } = useEmployeeData();

  // const [appliedFilters, setAppliedFilters] = useState({
  //   searchQuery: "",
  //   searchBy: "Emp ID",
  //   startMonth: null,
  //   endMonth: null,
  // });
  const [appliedFilters, setAppliedFilters] = useState({
    searchQuery: "",
    searchBy: "Emp ID",
    startMonth: null,
    endMonth: null,
    selectedYear: null,
    selectedMonths: [],
    selectedQuarters: [],
    clients: "All",
  });

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPosition, setInfoPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("Emp ID");
  const [errorSearch, setErrorSearch] = useState("");
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [timelineSelection, setTimelineSelection] = useState("range");

  const [year, setYear] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [selectedQuarters, setSelectedQuarters] = useState([]);

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

  const quarterEndMonth = {
    Q1: 3,
    Q2: 6,
    Q3: 9,
    Q4: 12,
  };

  const shiftRates = {
    shiftA: 500,
    shiftB: 350,
    shiftC: 100,
    prime: 700,
  };

  const isClearDisabled =
    !searchQuery &&
    !startMonth &&
    !endMonth &&
    !year &&
    selectedMonths.length === 0 &&
    selectedQuarters.length === 0;

  const pageSize = 10;
  const isPageNotFull = displayRows.length < pageSize;

  const isEndMonthInvalid =
    startMonth &&
    endMonth &&
    (dayjs(endMonth).isBefore(dayjs(startMonth), "month") ||
      dayjs(endMonth).isSame(dayjs(startMonth), "month"));

  const [info, setInfo] = useState([
    { "A (9PM to 6AM) - ₹500": "" },
    { "B (4PM to 1AM) - ₹350": "" },
    { "C (6AM to 3PM) - ₹100": "" },
    { "PRIME (12AM to 9AM) - ₹700": "" },
  ]);
  const pattern = /^[A-Za-z]{2}[A-Za-z0-9-_ ]*$/;
  const columns = [
    ...headers.map((header) => {
      if (header === "Shift Details") {
        return {
          field: "Shift Details",
          headerName: "Shift Details",
          flex: 1,
          sortable: true,
          disableColumnMenu: true,

          renderHeader: () => (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#fff",
              }}
            >
              <span>Shift Details</span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setInfoOpen((prev) => !prev);
                  setInfoOpen(true);

                  const rect = e.currentTarget.getBoundingClientRect();
                  const popupHeight = 100;
                  const iconHeight = rect.height;
                  setInfoPosition({
                    top:
                      rect.top +
                      window.scrollY +
                      iconHeight / 2 -
                      popupHeight / 2 -
                      100,
                    left: rect.left + window.scrollX - 100,
                  });
                }}
              >
                <Info size={16} color="#fff" />
              </IconButton>
            </Box>
          ),

          renderCell: (params) => formatShiftDetails(params.value),
        };
      }

      if (header === "Total Allowances") {
        return {
          field: "Total Allowances",
          headerName: "Total Allowances",
          flex: 1,
          sortable: true,
          disableColumnMenu: true,
          renderCell: (params) => formatINR(params.value),
        };
      }

      return {
        field: header,
        headerName: header,
        flex: 1,
        sortable: true,
        filterable: false,
        disableColumnMenu: true,
      };
    }),
    {
      field: "actions",
      headerName: "",
      width: 1,
      flex: 0,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
      disableColumnResize: true,
      resizable: false,

      renderCell: (params) => (
        <Button
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleIndividualEmployee(
              params.row["Emp ID"],
              params.row["Duration Month"],
              params.row["Payroll Month"]
            );
          }}
          disableRipple
          sx={{
            minWidth: 0,
            padding: "4px",
            backgroundColor: "transparent",
            "&:hover": { backgroundColor: "transparent" },
            "&:focus": { backgroundColor: "transparent" },
            "&:active": { backgroundColor: "transparent" },
            outline: "none",
            "&:focus-visible": { outline: "none" },
          }}
        >
          <Eye size={18} className="text-black hover:text-blue-600" />
        </Button>
      ),
    },
  ];

  columns.forEach((col) => {
    if (col.field === "Duration Month" || col.field === "Payroll Month") {
      col.renderCell = (params) => formatMonth(params.value);
    }
  });

  const buildSearchParams = (filters) => {
    const params = {};
    const q = filters.searchQuery?.trim();

    if (q && q.length > 2) {
      switch (filters.searchBy) {
        case "Emp ID":
          params.emp_id = q;
          break;

        case "Account Manager":
          params.account_manager = q;
          break;

        case "Client":
          params.client = { [q]: [] };
          break;

        case "Department":
          params.department = q;
          break;

        default:
          break;
      }
    }

    if (filters.department && filters.department !== "All") {
      params.department = filters.department;
    }

    if (filters.startMonth) params.start_month = filters.startMonth;
    if (filters.endMonth) params.end_month = filters.endMonth;

    if (filters.start !== undefined) params.start = filters.start;
    if (filters.limit !== undefined) params.limit = filters.limit;

    if (filters.selectedYear) params.selected_year = filters.selectedYear;

    if (filters.selectedMonths?.length)
      params.selected_months = filters.selectedMonths;

    if (filters.selectedQuarters?.length)
      params.selected_quarters = filters.selectedQuarters;

    if (filters.client && Object.keys(filters.client).length > 0) {
      params.client = filters.client;
    }

    return params;
  };

  useEffect(() => {
    const params = buildSearchParams({
      ...appliedFilters,
      start: (page - 1) * 10,
      limit: 10,
    });

    const hasParams = Object.keys(params).length > 0;

    if (hasParams) {
      debouncedFetch(params, page);
    } else {
      getProcessedData((page - 1) * 10, 10);
    }
  }, [page, appliedFilters]);

  useEffect(() => {
    loading ? setTableLoading(true) : setTableLoading(false);
  }, [loading]);


  const isSubmitDisabled =
  (timelineSelection === "range" && isEndMonthInvalid) ||
  (timelineSelection === "monthly" && (!year || selectedMonths.length === 0)) ||
  (timelineSelection === "quarterly" && (!year || selectedQuarters.length === 0));


  const handleSubmitFilters = () => {
  let start = startMonth;
  let end = endMonth;

  if (timelineSelection === "monthly") {
    start = `${dayjs(year).format("YYYY")}-${selectedMonths[0]}`;
    end = `${dayjs(year).format("YYYY")}-${selectedMonths.at(-1)}`;
  }

  if (timelineSelection === "quarterly") {
    const quarterToMonths = {
      Q1: ["01", "02", "03"],
      Q2: ["04", "05", "06"],
      Q3: ["07", "08", "09"],
      Q4: ["10", "11", "12"],
    };

    const months = selectedQuarters.flatMap(q => quarterToMonths[q]);
    start = `${dayjs(year).format("YYYY")}-${months[0]}`;
    end = `${dayjs(year).format("YYYY")}-${months.at(-1)}`;
  }

  setAppliedFilters({
    searchQuery,
    searchBy,
    startMonth: start ? dayjs(start).format("YYYY-MM") : null,
    endMonth: end ? dayjs(end).format("YYYY-MM") : null,
    selectedYear: year ? dayjs(year).format("YYYY") : null,
    selectedMonths,
    selectedQuarters,
    clients: "All",
  });

  handlePageChange(1);
};


  const handleDownload = async (searchQuery, startMonth, endMonth) => {
    setDownloadLoading(true);
    try {
      if (searchQuery?.trim() && startMonth) {
        await downloadSearchData({
          type: "SearchAndMonthRange",
          startMonth,
          endMonth,
          query: searchQuery.trim(),
          searchBy,
        });
      } else if (searchQuery?.trim()) {
        await downloadSearchData({
          type: "Text",
          query: searchQuery.trim(),
          searchBy,
        });
      } else if (startMonth) {
        await downloadSearchData({
          type: "MonthRange",
          startMonth,
          endMonth,
        });
      } else {
        await downloadSearchData({});
      }
    } finally {
      setDownloadLoading(false);
    }
  };
  const handleClear = () => {
    setSearchQuery("");
    setSearchBy("Emp ID");
    setErrorSearch("");
    setStartMonth(null);
    setEndMonth(null);
    setYear(null);
    setSelectedMonths([]);
    setSelectedQuarters([]);
    setTimelineSelection("range");

    setAppliedFilters({
      searchQuery: "",
      searchBy: "Emp ID",
      startMonth: null,
      endMonth: null,
      selectedYear: null,
      selectedMonths: [],
      selectedQuarters: [],
      clients: "All",
    });

    handlePageChange(1);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {[
          {
            label: "Head Count",
            value: shiftSummary?.head_count ?? 0,
            bg: "#FF5722",
          },

          {
            label: `Shift A - ₹${shiftRates.shiftA}`,
            value: formatINR(shiftSummary?.shiftA ?? 0),
            bg: "#03A9F4",
          },
          {
            label: `Shift B - ₹${shiftRates.shiftB}`,
            value: formatINR(shiftSummary?.shiftB ?? 0),
            bg: "#E91E63",
          },
          {
            label: `Shift C - ₹${shiftRates.shiftC}`,
            value: formatINR(shiftSummary?.shiftC ?? 0),
            bg: "#FF9800",
          },
          {
            label: `Prime - ₹${shiftRates.prime}`,
            value: formatINR(shiftSummary?.prime ?? 0),
            bg: "#9C27B0",
          },
          {
            label: "Total Allowances",
            value: formatINR(shiftSummary?.total ?? 0),
            bg: "#4CAF50",
          },
        ].map(({ label, value, bg }) => (
          <Box
            key={label}
            sx={{
              flex: 1,
              height: 100,
              backgroundColor: bg,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#000",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {label}
            </Typography>

            <Typography variant="h3" fontWeight={700} fontSize="26px" mt={1}>
              {value}
              {/* {label === "Head Count" ? value : formatRupees(value)} */}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",
              mb: 2,
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flex: 1,
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Box sx={{ display: "flex", width: "100%" }}>
                <Tooltip title="Download Allowance Data">
                  <Button
                    sx={{ ml: "auto" }}
                    variant="outlined"
                    onClick={() =>
                      handleDownload(searchQuery, startMonth, endMonth)
                    }
                  >
                    Download Data
                  </Button>
                </Tooltip>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center",
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <DynamicSearchSelector
                  options={[
                    { value: "Emp ID", label: "Emp ID" },
                    { value: "Account Manager", label: "Client Partner" },
                    { value: "Department", label: "Department" },
                    { value: "Client", label: "Client" },
                  ]}
                  selectedOption={searchBy}
                  setSelectedOption={setSearchBy}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  error={errorSearch}
                  setError={setErrorSearch}
                  pattern={pattern}
                />

                <TimeRangeSelector
                  timelineSelection={timelineSelection}
                  setTimelineSelection={setTimelineSelection}
                  timelines={[
                    { value: "range", label: "Range" },
                    { value: "monthly", label: "Monthly" },
                    { value: "quarterly", label: "Quarterly" },
                  ]}
                  startMonth={startMonth}
                  setStartMonth={setStartMonth}
                  endMonth={endMonth}
                  setEndMonth={setEndMonth}
                  isStartMonthInvalid={false}
                  isEndMonthInvalid={isEndMonthInvalid}
                  year={year}
                  setYear={setYear}
                  monthsList={monthsList}
                  multipleMonths={selectedMonths}
                  setMultipleMonths={setSelectedMonths}
                  quarterlyList={quarterlyList}
                  quarterlySelection={selectedQuarters}
                  setQuarterlySelection={setSelectedQuarters}
                />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    minHeight: 56,
                  }}
                >
                  <Button
  variant="contained"
  size="small"
  onClick={handleSubmitFilters}
  disabled={isSubmitDisabled}
  sx={{ height: 40 }}
>
  Search
</Button>


                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleClear}
                    disabled={isClearDisabled}
                    sx={{ minHeight: "40px", textTransform: "none" }}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              // mt: isEndMonthInvalid ? 6 : 2,
              mt: 4,
              transition: "margin-top 0.2s ease",
            }}
          >
            {downloadLoading && (
              <Box
                sx={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Box
                  sx={{
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography>Downloading...</Typography>
                </Box>
              </Box>
            )}

            <DataGrid
              rows={displayRows}
              columns={columns}
              autoHeight={false}
              rowHeight={52}
              // disableVirtualization

              pagination={false}
              hideFooter
              scrollbarSize={0}
              disableRowSelectionOnClick
              disableColumnReorder
              disableColumnSorting
              disableExtendRowFullWidth
              slots={{
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="error.main">
                      {error || "No data found"}
                    </Typography>
                  </Box>
                ),
              }}
              sx={{
                // border: "1px solid #D3D3D3",
                // maxHeight: "80vh",
                borderTop: "1px solid #D3D3D3",
                // borderLeft: "1px solid #D3D3D3",
                // borderRight: "1px solid #D3D3D3",
                borderRight: "none",
                borderBottom: isPageNotFull ? "none" : "1px solid #D3D3D3",
                height: "70vh",

                "& .MuiDataGrid-virtualScroller": {
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                },
                "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                  display: "none",
                },
                "&.MuiDataGrid-root": {
                  borderRight: "none",
                  borderLeft: "none",
                },
                "&.MuiDataGrid-withBorderColor": {
                  borderRight: "none",
                },
                "& .MuiDataGrid-row": {
                  borderLeft: "1px solid #D3D3D3",
                  borderRight: "1px solid #D3D3D3",
                },

                "& .MuiDataGrid-scrollbar": {
                  display: "none !important",
                },

                "& .MuiDataGrid-columnHeaders": {
                  borderBottom: "1px solid #fff",
                  borderLeft: "1px solid #D3D3D3",
                  borderRight: "1px solid #D3D3D3",
                },

                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#000",
                  color: "#fff",
                  borderRight: "1px solid #fff",
                },

                "& .MuiDataGrid-columnHeader:last-of-type": {
                  borderRight: "none",
                },

                "& .MuiDataGrid-columnHeaderTitleContainer": {
                  justifyContent: "center",
                },

                "& .MuiDataGrid-cell": {
                  borderBottom: "none",
                  borderRight: "1px solid #D3D3D3",
                },

                "& .MuiDataGrid-cell:last-of-type": {
                  borderRight: "none",
                },

                "& .MuiDataGrid-filler": {
                  borderRight: "none",
                },
                "& .MuiDataGrid-columnSeparator": {
                  display: "none",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            />
          </Box>

          {totalPages > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                p: 1,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, value) => handlePageChange(value)}
                color="primary"
                size="small"
                disabled={loading}
                siblingCount={1}
                boundaryCount={1}
                shape="rounded"
              />
            </Box>
          )}
        </Box>

        {modelOpen && selectedEmployee && (
          <EmployeeModal
            employee={selectedEmployee}
            onClose={() => setModelOpen(false)}
            loading={loadingDetail}
            setPopupMessage={(msg) => {
              setPopupMessage(msg);
              setPopupVisible(true);
            }}
            setPopupType={setPopupType}
          />
        )}

        {popupVisible && (
          <>
            {/* Overlay that blurs the background */}
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                backdropFilter: "blur(4px)",
                backgroundColor: "rgba(0,0,0,0.2)",
                zIndex: 2500,
              }}
            />

            {/* Centered Popup */}
            <Box
              sx={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                p: 3,
                minWidth: 300,
                borderRadius: 2,
                backgroundColor: "#fff",

                color: popupType === "success" ? "green" : "red",

                border:
                  popupType === "success"
                    ? "2px solid #22c55e"
                    : "2px solid #ef4444",

                boxShadow:
                  popupType === "success"
                    ? "0 0 12px rgba(34,197,94,0.45)"
                    : "0 0 12px rgba(239,68,68,0.45)",
                zIndex: 3000,
                boxShadow: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
                {popupMessage}
              </Typography>

              <button
                onClick={() => setPopupVisible(false)}
                style={{
                  marginTop: "8px",
                  background: "#1E3A8A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </Box>
          </>
        )}
        {infoOpen && (
          <Portal>
            <Box
              onClick={(e) => {
                console.log(e);
                e.stopPropagation();
              }}
              sx={{
                position: "fixed",
                top: infoPosition.top,
                left: infoPosition.left,
                background: "white",
                boxShadow: 3,
                borderRadius: 1,
                p: 2,
                minWidth: 220,
                zIndex: 2000,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <IconButton size="small" onClick={() => setInfoOpen(false)}>
                  <X size={16} />
                </IconButton>
              </Box>

              {info.map((details, i) => {
                const key = Object.keys(details)[0];
                const value = Object.values(details)[0];
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography fontWeight={600}>{key}</Typography>
                    <Typography>{value}</Typography>
                  </Box>
                );
              })}
            </Box>
          </Portal>
        )}
      </Box>
    </>
  );
};
export default DataTable;
