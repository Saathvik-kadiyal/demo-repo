import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ReusableTable from "../component/ReusableTable/ReusableTable.jsx";
import EmployeeModal from "../component/EmployeeModel.jsx";
import KpiCard from "../component/kpicards/KpiCard";
import ShiftKpiCard from "../component/kpicards/ShiftKpiCard";
import PopupMessage from "../component/popupMessages/PopupMessage";
import { allowanceColumns } from "../component/ReusableTable/columns.js";
import { mapEmployeeForTable } from "../component/ReusableTable/normalizeApiData.js";
import { normalizeFilters } from "../utils/normalizeFilters";
import FilterDrawer from "../component/fliters/FilterDrawer.jsx";
import arrow from "../assets/arrow.svg";
import ActionButton from "../component/buttons/ActionButton";
import allowanceIcon from "../assets/allowance.svg";
import { useEmployeeData } from "../hooks/useEmployeeData.jsx";
import SearchInput from "../component/SearchInput.jsx";
import { debounce, downloadFilteredExcel } from "../utils/helper.js";
import Pagination from "../component/pagination/Pagination.jsx";
import { formatRupeesWithUnit } from "../utils/utils.js";

const FileInput = () => {
  const navigate = useNavigate();

  const [tableLoading, setTableLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("emp_id");
  const [currentPayload, setCurrentPayload] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [pageRows, setPageRows] = useState(10);

  const {
    rows,
    errorFileLink,
    errorRows,
    getProcessedData,
    fetchDataFromBackend,
    downloadExcel,
    downloadErrorExcel,
    success,
    error,
    shiftSummary,
    totalRecords,
  } = useEmployeeData();

  useEffect(() => {
    setTotalCount(totalRecords);
  }, [totalRecords]);

  const NoOfPages = Math.floor(totalRecords / pageRows);

  const tableData = mapEmployeeForTable(rows);
  const safeErrorRows = errorRows || [];

  /* ----------------------------------------------------
      SINGLE SOURCE OF TRUTH FOR PAYLOAD
  ---------------------------------------------------- */
  const buildPayload = (
    baseFilters = {},
    searchValue = searchText,
    searchKey = searchBy
  ) => {
    const payload = { ...baseFilters };

    if (searchValue?.trim()) {
      const value = searchValue.trim();

      if (searchKey === "emp_id") payload.emp_id = value;
      else if (searchKey === "client_partner") payload.client_partner = value;
      else if (searchKey === "clients") payload.clients = [value];
    }

    return payload;
  };

  /* ----------------------------------------------------
    Fetch
  ---------------------------------------------------- */
  const runFetch = useCallback(
    async (payloadFilters = {}) => {
      console.log("Running fetch with filters:", payloadFilters);
      setTableLoading(true);
      try {
        const normalized = normalizeFilters(payloadFilters);

        // Do NOT reference searchText here!
        // Instead, pass the payload fully prepared from input/filters.

        const payload = {
          start: currentPage * limit,
          limit,
          sort_by: "total_allowance",
          sort_order: "default",
          ...normalized,
        };

        setCurrentPayload(payload);
        await getProcessedData(payload);
        setTotalCount(rows?.total_records || 0);
      } finally {
        setTableLoading(false);
      }
    },
    [getProcessedData, currentPage, limit] // <-- remove searchText & searchBy
  );

  const debouncedRunFetch = useCallback(
    debounce((payload) => {
      runFetch(payload);
    }, 800),
    [runFetch]
  );

  useEffect(() => {
    runFetch({});
  }, [runFetch]);

  /* ----------------------------------------------------
      Filters
  ---------------------------------------------------- */
  const handleApplyFilters = (filtersObj) => {
    setFilters(filtersObj);
    setCurrentPage(0);
    runFetch(buildPayload(filtersObj));
  };

  /* ----------------------------------------------------
      Search
  ---------------------------------------------------- */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    runFetch(buildPayload(filters, value));
  };

  /* ----------------------------------------------------
      File Upload
  ---------------------------------------------------- */
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setTableLoading(true);
    try {
      await fetchDataFromBackend(file, localStorage.getItem("access_token"));
    } finally {
      setTableLoading(false);
    }
  };

  /* ----------------------------------------------------
      KPI
  ---------------------------------------------------- */
  const totalAllowance = shiftSummary?.total || 0;

  const shiftKpiCards = Object.entries(shiftSummary || {})
    .filter(([k]) => !["total", "headcount", "head_count"].includes(k))
    .map(([ShiftType, ShiftCount]) => ({
      ShiftType,
      ShiftCount:formatRupeesWithUnit(ShiftCount),
      ShiftCountSize: "2rem",
      ShiftTypeSize: "1rem",
    }));

  /* ----------------------------------------------------
      Popups
  ---------------------------------------------------- */
  useEffect(() => {
    if (errorFileLink) {
      setPopupMessage("File processed with errors.");
      setPopupSeverity("error");
      setPopupOpen(true);
    } else if (error) {
      setPopupMessage(error);
      setPopupSeverity("invalid");
      setPopupOpen(true);
    } else if (success) {
      setPopupMessage(success);
      setPopupSeverity("success");
      setPopupOpen(true);
    }
  }, [errorFileLink, error, success]);

  const handleExportData = async () => {
    try {
      setTableLoading(true);

      if (!currentPayload) return;

      // remove pagination before sending
      const { start, limit, ...exportPayload } = currentPayload;

      await downloadFilteredExcel(exportPayload);
    } catch (err) {
      setPopupMessage("Failed to export data");
      setPopupSeverity("error");
      setPopupOpen(true);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    runFetch(filters);
  }, [currentPage, limit]);

  useEffect(() => {
    if (popupMessage) {
      setPopupOpen(true);
    }
  }, [popupMessage]);

  const handleOpenEmployeeModal = (employee) => {
    console.log("Opening modal for employee:", employee);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const getPagination = (current, total) => {
    const pages = [];

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push("...");
    }

    pages.push(total);

    return pages;
  };

  /* ----------------------------------------------------
      UI
  ---------------------------------------------------- */
  return (
    <Box sx={{ width: "100%", p: 2, position: "relative" }}>
      {tableLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 9,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => navigate("/")}
        >
          <img
            src={arrow}
            alt="back"
            style={{ transform: "rotate(90deg)" }} // rotates 180°
          />
          <Typography>Shift Allowances Data</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#1C2F72",
              textTransform: "none",
            }}
          >
            Upload File
            <input hidden type="file" onChange={handleFileChange} />
          </Button>
          <Button
            variant="outlined"
            sx={{
              backgroundColor: "white",
              color: "#1C2F72",
              textTransform: "none",
              border: "1px solid #1C2F72",
            }}
            onClick={handleExportData}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            onClick={downloadExcel}
            sx={{
              border: "none",
              background: "transparent",
              boxShadow: "none",
              color: "#0F3C70",
              textTransform: "none",
            }}
          >
            Download Template
          </Button>
        </Stack>
      </Box>

      {/* KPI */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <KpiCard
          HeaderIcon={allowanceIcon}
          HeaderText="Total Allowance"
          BodyNumber={formatRupeesWithUnit(totalAllowance)}
        />
        {shiftKpiCards.map((kpi, i) => (
          <ShiftKpiCard key={i} {...kpi} />
        ))}
      </Box>

      {/* Search + Filter */}
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Left */}
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Employee Details
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchText}
            onChange={(value) => setSearchText(value)}
            onKeyDown={(e) => {
              console.log(e);
              if (e.key === "Enter") {
                const currentValue = e.target.value.trim(); // <-- use input value directly
                const payload = { ...filters };

                if (currentValue) {
                  if (searchBy === "emp_id") payload.emp_id = currentValue;
                  else if (searchBy === "client_partner")
                    payload.client_partner = currentValue;
                  else if (searchBy === "clients")
                    payload.clients = [currentValue];
                } else {
                  delete payload.emp_id;
                  delete payload.client_partner;
                  delete payload.clients;
                }

                setCurrentPage(0);
                runFetch(payload); // call API once
              }
            }}
          />

          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="
      custom-select
        border border-[#E0E0E0]
        rounded-sm px-2 py-2
        text-sm bg-white
        focus:outline-none
        text-gray-400
        max-w-sm
        w-[212px]
      "
          >
            <option value="emp_id">Employee ID</option>
            <option value="clients">Clients</option>
            <option value="client_partner">Client Partner</option>
          </select>

          <FilterDrawer onApply={handleApplyFilters} filters={filters} />
        </div>
      </div>

      {/* Table */}
      <div className="w-full h-full overflow-x-auto">
        <ReusableTable
          data={tableData}
          columns={allowanceColumns}
          getRowKey={(row) => row.emp_id}
          // onActionClick={(emp) => {
          //   setSelectedEmployee(emp);
          //   setShowModal(true);
          // }
          onActionClick={handleOpenEmployeeModal}
        />
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={NoOfPages || 1}
          onPageChange={setCurrentPage}

        />
      </div>

      {showModal && selectedEmployee && (
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setShowModal(false)}
          setPopupMessage={setPopupMessage}
          setPopupType={setPopupSeverity}
        />
      )}

      <PopupMessage
        open={popupOpen}
        message={popupMessage}
        severity={popupSeverity}
        onClose={() => setPopupOpen(false)}
        actions={
          popupSeverity === "error" && errorFileLink ? (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={() =>
                  navigate("/shift-allowance/edit", {
                    state: { errorRows: safeErrorRows },
                  })
                }
                style={{
                  background: "#1E3A8A",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textTransform: "none",
                }}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => downloadErrorExcel(errorFileLink)}
                style={{
                  background: "transparent",
                  color: "#1E3A8A",
                  border: "2px solid #1E3A8A",
                  borderRadius: "4px",
                  padding: "6px 16px",
                  cursor: "pointer",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textTransform: "none",
                }}
              >
                Download Error File
              </Button>
            </>
          ) : null
        }
      />
    </Box>
  );
};

export default FileInput;
