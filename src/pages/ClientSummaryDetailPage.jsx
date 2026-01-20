import React, { useState, useEffect, useCallback, useMemo, use } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import { ChevronDown, Info, X } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  debounce,
  downloadClientSummary,
  fetchClientDepartments,
  fetchClientSummary,
} from "../utils/helper";
import ClientSummaryTable from "../component/ClientSummaryTable";
import DynamicSearchSelector from "../component/DynamicSearchSelector";
import TimeRangeSelector from "../component/TimeRangeSelector";

const ClientSummaryDetailedPage = () => {
  const [selectedClients, setSelectedClients] = useState([]);
  const [clientDepartments, setClientDepartments] = useState([]);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [expandedClient, setExpandedClient] = useState(null);
  const [startMonth, setStartMonth] = useState(null);
  const [endMonth, setEndMonth] = useState(null);
  const [searchBy, setSearchBy] = useState("Emp ID");
  const [searchQuery, setSearchQuery] = useState("");
  const [errorSearch, setErrorSearch] = useState("");
  // const [search, setSearch] = useState("");
  // const [amSearch, setAmSearch] = useState("");
  // const [selectedAM, setSelectedAM] = useState("");
  const [timelineSelection, setTimelineSelection] = useState("range");
  const [year, setYear] = useState(null);
  const [multipleMonths, setMultipleMonths] = useState([]);
  const [quarterlySelection, setQuarterlySelection] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState([]);

  const pattern = /^[A-Za-z]{2}[A-Za-z0-9-_ ]*$/;

  const isEndMonthInvalid =
    startMonth &&
    endMonth &&
    (dayjs(endMonth).isBefore(dayjs(startMonth), "month") ||
      dayjs(endMonth).isSame(dayjs(startMonth), "month"));

  const isStartMonthInvalid = !startMonth && endMonth;

  const timelines = [
    { label: "Monthly", value: "monthly" },
    { label: "Quarterly", value: "quarterly" },
    { label: "Range", value: "range" },
  ];

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
    debounce(async (payload) => {
      console.log(payload);
      setLoading(true);
      setError("");
      try {
        const res = await fetchClientSummary(payload);
        setData(res);
      } catch (err) {
        setError(err?.message || "Unable to fetch data");
        setData({});
      } finally {
        setLoading(false);
      }
    }, 600),
    []
  );

  useEffect(() => {
    const loadClientDepartments = async () => {
      try {
        setLoading(true);
        const data = await fetchClientDepartments();
        setClientDepartments(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadClientDepartments();
  }, []);

  const toggleDepartment = (client, dept) => {
    setSelectedClients((prev) => {
      const current = prev[client] || [];
      if (dept === "ALL") {
        const allDepartments =
          clientDepartments.find((c) => c.client === client)?.departments || [];

        if (current.length === allDepartments.length) {
          const updatedState = { ...prev };
          delete updatedState[client];
          return updatedState;
        } else {
          return { ...prev, [client]: [...allDepartments] };
        }
      } else {
        const newDepartments = current.includes(dept)
          ? current.filter((d) => d !== dept)
          : [...current, dept];

        if (newDepartments.length === 0) {
          const updatedState = { ...prev };
          delete updatedState[client];
          return updatedState;
        }

        return { ...prev, [client]: newDepartments };
      }
    });
  };

  useEffect(() => {
    let payload = {
      clients: "ALL",
    };
    runFetch(payload);
  }, []);

  // const accountManagerList = useMemo(() => {
  //   const setAM = new Set();
  //   Object.values(data).forEach((monthObj) => {
  //     if (!monthObj) return;
  //     if (monthObj.clients && typeof monthObj.clients === "object") {
  //       Object.values(monthObj.clients).forEach((clientObj) => {
  //         const deps = clientObj.departments || {};
  //         Object.values(deps).forEach((dept) => {
  //           (dept.employees || []).forEach((e) => {
  //             if (e.account_manager) setAM.add(e.account_manager);
  //           });
  //         });
  //       });
  //     }
  //   });
  //   return Array.from(setAM).sort();
  // }, [data]);

  // const filteredAMs = useMemo(() => {
  //   return accountManagerList.filter((am) =>
  //     am.toLowerCase().includes(amSearch.toLowerCase())
  //   );
  // }, [amSearch, accountManagerList]);

  // const matchesSearch = (txt) =>
  //   !search ||
  //   ("" + (txt ?? "")).toLowerCase().includes(search.trim().toLowerCase());

  const monthKeys = useMemo(() => {
    return Object.keys(data)
      .filter((k) => k !== "total" && k !== "horizontal_total")
      .sort();
  }, [data]);

  let prevTotal = null;

  const buildClientSummaryPayload = () => {
    const payload = {
      clients:
        Object.keys(selectedClients).length > 0 ? selectedClients : "ALL",
    };

    if (timelineSelection === "range") {
      if (startMonth) {
        payload.start_month = dayjs(startMonth).format("YYYY-MM");
      }
      if (endMonth) {
        payload.end_month = dayjs(endMonth).format("YYYY-MM");
      }
    }

    if (timelineSelection === "monthly") {
      if (year) {
        payload.selected_year = dayjs(year).format("YYYY");
      }
      if (multipleMonths?.length > 0) {
        payload.selected_months = multipleMonths;
      }
    }

    if (timelineSelection === "quarterly") {
      if (year) {
        payload.selected_year = dayjs(year).format("YYYY");
      }
      if (quarterlySelection?.length > 0) {
        payload.selected_quarters = quarterlySelection;
      }
    }

    if (searchBy && searchQuery && pattern.test(searchQuery)) {
      if (searchBy === "Emp ID") {
        payload.emp_id = searchQuery.trim();
      }
      if (searchBy === "Account Manager") {
        payload.account_manager = searchQuery.trim();
      }
    }

    return payload;
  };

  const handleClientSummaryWithDepartments = () => {
    const payload = buildClientSummaryPayload();

    runFetch(payload);
    setClientDialogOpen(false);
  };

  const handleDownload = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = buildClientSummaryPayload();
      const blob = await downloadClientSummary(payload);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "client_summary.xlsx";
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Download failed");
    } finally {
      setLoading(false);
    }
  };

  const formatMonthKey = (monthKey) => {
    if (!monthKey) return "";
    if (monthKey.includes(" - ")) {
      const [start, end] = monthKey.split(" - ");
      let first = start.split("-")[1];
      let last = end.split("-")[1];
      let quarter = "";
      if (first === "01" && last === "03") quarter = "Q1";
      else if (first === "04" && last === "06") quarter = "Q2";
      else if (first === "07" && last === "09") quarter = "Q3";
      else if (first === "10" && last === "12") quarter = "Q4";

      return `${quarter} ${dayjs(`${start}-01`).format("MMM YYYY")}   ${dayjs(
        `${end}-01`
      ).format("MMM YYYY")}`;
    }
    return dayjs(`${monthKey}-01`).format("MMM YYYY");
  };

  useEffect(() => {
    if (startMonth && endMonth && startMonth.isAfter(endMonth)) {
      setEndMonth(startMonth);
    }
  }, [startMonth, endMonth]);

  const monthSummaries = useMemo(() => {
    let prev = null;

    return monthKeys.map((monthKey) => {
      const monthObj = data?.[monthKey] || {};
      const totals = monthObj.month_total || {
        total_head_count: 0,
        A: 0,
        B: 0,
        C: 0,
        PRIME: 0,
        total_allowance: 0,
      };

      const diff = prev !== null ? totals.total_allowance - prev : 0;

      let diffColor = "black";
      if (prev !== null) {
        if (diff > 0) diffColor = "red";
        else if (diff < 0) diffColor = "green";
      }

      prev = totals.total_allowance;

      return {
        monthKey,
        formattedMonth: formatMonthKey(monthKey),
        totals,
        diff,
        diffColor,
        clientsMap: monthObj.clients || {},
      };
    });
  }, [data, monthKeys]);

  useEffect(() => {
    setEndMonth(null);
    setStartMonth(null);
    setYear(null);
    setQuarterlySelection([]);
    setMultipleMonths([]);
  }, [timelineSelection]);

  return (
    <Box
      sx={{
        position: "relative",
        py: 2,
        px: 4,
        m: 0,
        height: "100%",
        overflow: clientDialogOpen ? "hidden" : "auto",
        transition: "all 0.3s ease-in-out",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Box
        onClick={() => setClientDialogOpen(false)}
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 19,
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(6px)",
          opacity: clientDialogOpen ? 1 : 0,
          pointerEvents: clientDialogOpen ? "auto" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 320,
            height: "100%",
            zIndex: 20,
            backgroundColor: "white",
            padding: 2,
            transform: clientDialogOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6">Select Clients</Typography>
            <X
              style={{ cursor: "pointer" }}
              onClick={() => setClientDialogOpen(false)}
            />
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {clientDepartments.map(({ client, departments }) => {
              const isExpanded = expandedClient === client;
              const clientChecked =
                selectedClients[client]?.length === departments.length &&
                departments.length > 0;
              const clientIndeterminate =
                selectedClients[client]?.length > 0 &&
                selectedClients[client]?.length < departments.length;

              return (
                <Accordion
                  key={client}
                  expanded={isExpanded}
                  onChange={() => setExpandedClient(isExpanded ? null : client)}
                  sx={{
                    mb: 1,
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    width: "100%",
                    transition: "backgroundColor 0.3s ease",
                  }}
                  disableGutters
                >
                  <AccordionSummary
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      width: "100%",
                      transition: "transform 0.1s ease",
                    }}
                  >
                    <span className="flex items-center w-[90%]">
                      <FormControlLabel
                        sx={{ alignItems: "center" }}
                        control={
                          <Checkbox
                            disableRipple
                            checked={clientChecked}
                            indeterminate={clientIndeterminate}
                            onChange={() => toggleDepartment(client, "ALL")}
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              transition:
                                "background-color 0.2s ease, transform 0.2s ease",
                              "&:focus": {
                                outline: "none",
                                boxShadow: "none",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography fontWeight={600} fontSize={12}>
                            {client}
                          </Typography>
                        }
                      />
                    </span>
                    <span
                      className="flex items-center"
                      style={{
                        transition: "all 0.3s ease",
                        transform: isExpanded
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <ChevronDown size={20} />
                    </span>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 2, py: 1 }}>
                    {departments.map((dept) => (
                      <FormControlLabel
                        key={dept}
                        control={
                          <Checkbox
                            disableRipple
                            checked={
                              selectedClients[client]?.includes(dept) || false
                            }
                            onChange={() => toggleDepartment(client, dept)}
                            sx={{
                              transition: " .3s ease",
                            }}
                          />
                        }
                        label={dept}
                        sx={{
                          display: "block",
                          ml: 3,
                          mb: 0.5,
                          transition: "none",
                        }}
                      />
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mb: 4,
          alignItems: "center",
        }}
      >
        <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    justifyContent: "space-between",
    width: "100%",
    flexDirection: {
      xs: "column",
      md: "row",   
    },
  }}
>
  <Box>
    <Button
      variant="outlined"
      color="primary"
      sx={{ py: 1, transition: "all 0.3s ease" }}
      size="small"
      onClick={() => setClientDialogOpen(true)}
    >
      Select Clients
    </Button>
  </Box>

  <Button
    variant="outlined"
    onClick={handleDownload}
  >
    Download Data
  </Button>
</Box>


        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            gap: 2,
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          <DynamicSearchSelector
  options={[
    { value: "Emp ID", label: "Emp ID" },
    { value: "Account Manager", label: "Client Partner" },
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
  timelines={timelines}
  startMonth={startMonth}
  setStartMonth={setStartMonth}
  endMonth={endMonth}
  setEndMonth={setEndMonth}
  isStartMonthInvalid={isStartMonthInvalid}
  isEndMonthInvalid={isEndMonthInvalid}
  year={year}
  setYear={setYear}
  monthsList={monthsList}
  multipleMonths={multipleMonths}
  setMultipleMonths={setMultipleMonths}
  quarterlyList={quarterlyList}
  quarterlySelection={quarterlySelection}
  setQuarterlySelection={setQuarterlySelection}
/>


          

          <Button
            variant="contained"
            disabled={isEndMonthInvalid || (startMonth && !endMonth)}
            onClick={() => {
              handleClientSummaryWithDepartments();
            }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setStartMonth(null);
              setEndMonth(null);
              setYear(null);
              setMultipleMonths([]);
              setQuarterlySelection([]);
              setSelectedClients([]);
              runFetch({ clients: "ALL" });
            }}
          >
            Clear
          </Button>
        </Box>
      </Box>
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              padding: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              minWidth: 200,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body1" fontWeight={500} color="white">
              Loading...
            </Typography>
          </Box>
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {monthSummaries.map(
        ({ monthKey, formattedMonth, totals, diff, diffColor, clientsMap }) => (
          <Accordion
            key={monthKey}
            expanded={expandedMonth.includes(monthKey)}
            onChange={() => {
              setExpandedMonth((prev) =>
                prev.includes(monthKey)
                  ? prev.filter((key) => key !== monthKey)
                  : [...prev, monthKey]
              );
            }}
            TransitionProps={{ timeout: 300 }}
            sx={{
              mb: 2,
              boxShadow: "none",
              border: "1px solid #ddd",
              width: "100%",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <AccordionSummary
              sx={{
                position: "relative",
                top: 0,
                zIndex: 5,
                backgroundColor: "#f5f5f5",
                px: 2,
                "& .MuiAccordionSummary-content": {
                  margin: 0,
                  transition: "margin 0.3s ease",
                },
                transition: "all 0.3s ease",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography fontWeight="bold">{formattedMonth}</Typography>

                <Typography fontWeight="bold" color={diffColor}>
                  Headcount: {totals.total_head_count} — Total: ₹
                  {totals.total_allowance}
                  {diff !== 0 && ` (${diff > 0 ? "+" : ""}${diff})`}
                </Typography>

                <Box
                  sx={{
                    transition: "transform 0.1s ease",
                    transform: expandedMonth.includes(monthKey)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <ChevronDown />
                </Box>
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "scroll",
                  position: "relative",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {loading ? (
                  <Box sx={{ p: 2 }}>
                    <Typography>Loading...</Typography>
                  </Box>
                ) : data?.message ? (
                  <Box sx={{ p: 2 }}>
                    <Typography color="error">{data.message}</Typography>
                  </Box>
                ) : (
                  expandedMonth.includes(monthKey) && (
                    <ClientSummaryTable
                      clientsMap={clientsMap}
                      monthTotals={totals.total_allowance}
                      monthTotalA={totals.A}
                      monthTotalB={totals.B}
                      monthTotalC={totals.C}
                      monthTotalPRIME={totals.PRIME}
                      monthHeadCount={totals.total_head_count}
                    />
                  )
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        )
      )}
    </Box>
  );
};

export default ClientSummaryDetailedPage;
