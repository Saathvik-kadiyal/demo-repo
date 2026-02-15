import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { downloadClientSummary, fetchClientSummary } from "../utils/helper";
import ReusableTable from "../component/ReusableTable/ReusableTable";
import { normalizeClientSummaryData } from "../component/ReusableTable/normalizeApiData";
import {
  clientAnalyticsClientColumns,
  clientAnalyticsEmployeeColumns,
} from "../component/ReusableTable/columns";
import { normalizeFilters } from "../utils/normalizeFilters";
import FilterDrawer from "../component/fliters/FilterDrawer";
import calender from "../assets/calender.svg";
import arrow from "../assets/arrow.svg";

const ClientSummaryDetailedPage = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedMonth, setExpandedMonth] = useState([]);
  const [filters, setFilters] = useState({});

  const monthKeys = useMemo(() => {
    return Object.keys(data)
      .filter((k) => k !== "total" && k !== "horizontal_total")
      .sort();
  }, [data]);

  // Function to fetch data
  const runFetch = useCallback(async (filters) => {
    setLoading(true);
    setError("");
    try {
      const payload = normalizeFilters(filters);
      const res = await fetchClientSummary(payload);
      console.log(payload)
      setData(res);
    } catch (err) {
      setError(err?.message || "Unable to fetch data");
      setData({});
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on page load
  useEffect(() => {
    runFetch(filters);
  }, [filters,runFetch]);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = normalizeFilters(filters);
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

 const monthSummaries = useMemo(() => {
  const periods = data.periods || {};
  let prev = null;
  return Object.keys(periods).map((monthKey) => {
    const monthObj = periods[monthKey] || {};
    const totals = monthObj.month_total || {
      total_head_count: 0,
      total_allowance: 0,
    };
    const diff = prev !== null ? totals.total_allowance - prev : 0;
    prev = totals.total_allowance;

    return {
      monthKey,
      totals,
      diff,
      diffColor: diff > 0 ? "red" : diff < 0 ? "green" : "black",
      clientsMap: monthObj.clients || {},
    };
  });
}, [data]);

  return (
    <Box sx={{ position: "relative", py: 2, px: 4, height: "100%", overflow: "auto" }}>
      {/* Filter & Download */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <FilterDrawer
  onApply={(filters) => {
    setFilters(filters);
  }}
/>

        <Button variant="outlined" onClick={handleDownload}>Download Data</Button>
      </Box>

      {/* Loading Overlay */}
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
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Error */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Month Summaries */}
      {monthSummaries.length === 0 && !loading && (
        <Typography>No data available</Typography>
      )}

      {monthSummaries.map(({ monthKey, totals, diffColor, clientsMap }) => (
        <Box key={monthKey} sx={{ mb: 2 }}>
          {/* Month Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              px: 2,
              py: 1,
              cursor: "pointer",
            }}
            onClick={() =>
              setExpandedMonth((prev) =>
                prev.includes(monthKey)
                  ? prev.filter((k) => k !== monthKey)
                  : [...prev, monthKey]
              )
            }
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <img src={calender} alt="calendar" />
              <Typography fontSize={12} fontWeight={500}>{monthKey}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Typography fontSize={12} color={diffColor}>
                Headcount: {totals.total_head_count}
              </Typography>
              <Typography fontSize={12} color={diffColor}>
                Allowance: ₹{totals.total_allowance.toLocaleString()}
              </Typography>
              <img
                src={arrow}
                alt="arrow"
                style={{
                  transform: expandedMonth.includes(monthKey)
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "0.3s",
                }}
              />
            </Box>
          </Box>

          {/* Expanded Table */}
          {expandedMonth.includes(monthKey) && (
            <Box sx={{ p: 2 }}>
              <ReusableTable
                data={normalizeClientSummaryData({
                  clients: clientsMap,
                  month_total: totals,
                })}
                columns={clientAnalyticsClientColumns}
                nestedColumns={clientAnalyticsEmployeeColumns}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ClientSummaryDetailedPage;
