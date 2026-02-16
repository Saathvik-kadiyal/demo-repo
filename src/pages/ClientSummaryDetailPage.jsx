import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import {
  fetchClientSummary,
  downloadClientSummary,
} from "../utils/helper";
import { normalizeFilters } from "../utils/normalizeFilters";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import {
  clientAnalyticsClientColumns,
  clientAnalyticsEmployeeColumns,
} from "../component/ReusableTable/columns";
import { normalizeClientSummaryData } from "../component/ReusableTable/normalizeApiData";
import FilterDrawer from "../component/fliters/FilterDrawer";
import calender from "../assets/calender.svg";
import arrow from "../assets/arrow.svg";

const ClientSummaryDetailedPage = () => {
  const [data, setData] = useState({});
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState([]);
  const [currentPayload, setCurrentPayload] = useState({});


const runFetch = useCallback(async (filters) => {
  setLoading(true);
  setError("");
console.log(filters)
  try {
    const payload = {};

    // Optional filters – only include if user selected
    if (filters.years?.length) payload.years = filters.years;
    if (filters.months?.length) payload.months = filters.months;
    if (filters.employeeId?.length) payload.emp_id = filters.employeeId;
    if (filters.client_partner?.length) payload.client_partner = filters.client_partner;
    if (filters.shifts && filters.shifts !== "ALL") payload.shifts = filters.shifts;
    if (filters.headcounts && filters.headcounts !== "ALL") payload.headcounts = filters.headcounts;

    // Always include clients and departments
    payload.clients = filters.clients || "ALL";
    payload.departments = filters.departments || "ALL";

    // Sorting
    payload.sort_by = "total_allowance";
    payload.sort_order = "desc";

    // Store payload for download
    setCurrentPayload(payload);

    const res = await fetchClientSummary(payload);
    setData(res);
  } catch (err) {
    setError(err?.message || "Unable to fetch data");
    setData({});
  } finally {
    setLoading(false);
  }
}, []);




  useEffect(() => {
    runFetch(filters);
  }, [filters, runFetch]);

const handleDownload = async () => {
  if (!currentPayload) return;

  setLoading(true);
  setError("");
  try {
    const blob = await downloadClientSummary(currentPayload);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "client_summary.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    setError(err?.message || "Download failed");
  } finally {
    setLoading(false);
  }
};


const monthSummaries = useMemo(() => {
  // Use the data object itself as periods
  const periods = data || {};
  let prev = null;

  return Object.keys(periods).map((monthKey) => {
    const monthObj = periods[monthKey] || {};
    const clients = monthObj.clients || {};

    // calculate totals dynamically
    let total_head_count = 0;
    let total_allowance = 0;

    Object.values(clients).forEach((client) => {
      total_head_count += client.client_head_count || 0;
      total_allowance += client.client_total || 0;
    });

    const totals = { total_head_count, total_allowance };

    const diff = prev !== null ? totals.total_allowance - prev : 0;
    prev = totals.total_allowance;

    return {
      monthKey,
      totals,
      diffColor: diff > 0 ? "red" : diff < 0 ? "green" : "black",
      clientsMap: clients,
    };
  });
}, [data]);



  /* ---------------------------------- UI ---------------------------------- */
  return (
    <Box
      sx={{
        position: "relative",
        py: 2,
        px: 4,
        height: "100%",
        overflow: "auto",
      }}
    >
      {/* FILTER + DOWNLOAD */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          mb: 4,
          gap: 2,
        }}
      >
        <FilterDrawer
          onApply={(appliedFilters) => setFilters(appliedFilters)}
        />

        <Button variant="outlined" onClick={handleDownload} sx={{
           backgroundColor:"white",
            color:"#1C2F72",
            textTransform: 'none',
            border:"1px solid #1C2F72"
        }}>
          Export Data
        </Button>
      </Box>

      {/* LOADING OVERLAY */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(6px)",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {/* ERROR */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* EMPTY STATE */}
      {!loading && monthSummaries.length === 0 && (
        <Typography>No data available</Typography>
      )}

      {/* MONTH ACCORDIONS (OLD STYLE) */}
      {monthSummaries.map(
        ({ monthKey, totals, diffColor, clientsMap }) => (
          <Box key={monthKey}>
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "white",
                px: 2,
                py: 1.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() =>
                setExpandedMonth((prev) =>
                  prev.includes(monthKey)
                    ? prev.filter((k) => k !== monthKey)
                    : [...prev, monthKey]
                )
              }
            >
              {/* LEFT */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <img src={calender} alt="calendar" />
                <Typography fontSize={12} fontWeight={500}>
                  {monthKey}
                </Typography>
                <Typography fontSize={12} color={diffColor}>
                  Headcount{" "}
                  <span style={{ fontWeight: 600 }}>
                    {totals.total_head_count}
                  </span>
                </Typography>

                <Typography fontSize={12} color={diffColor}>
                  Allowance{" "}
                  <span style={{ fontWeight: 600 }}>
                    ₹{totals.total_allowance.toLocaleString()}
                  </span>
                </Typography>
              </Box>

              {/* RIGHT */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                

                <img
                  src={arrow}
                  alt="arrow"
                  style={{
                    transform: expandedMonth.includes(monthKey)
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "0.3s ease",
                  }}
                />
              </Box>
            </Box>

            {/* EXPANDED CONTENT */}
            {expandedMonth.includes(monthKey) && (
              <div className="fade-in w-full h-full overflow-x-auto">
                <ReusableTable
  data={normalizeClientSummaryData({
    clients: clientsMap,
    month_total: totals, // optional, can ignore inside normalize function
  })}
  columns={clientAnalyticsClientColumns}
  nestedColumns={clientAnalyticsEmployeeColumns}
/>

              </div>
            )}
          </Box>
        )
      )}
    </Box>
  );
};

export default ClientSummaryDetailedPage;
