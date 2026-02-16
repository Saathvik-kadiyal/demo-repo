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
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

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
  } = useEmployeeData();

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
        start: page * limit,
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
  [getProcessedData, page, limit] // <-- remove searchText & searchBy
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
    setPage(0);
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
      ShiftCount,
      ShiftCountSize: "2rem",
      ShiftTypeSize: "1rem",
    }));

  /* ----------------------------------------------------
      Popups
  ---------------------------------------------------- */
  useEffect(() => {
    if (errorFileLink || error || success) {
      setPopupMessage(
        errorFileLink ? "File processed with errors." : error || success
      );
      setPopupSeverity(errorFileLink || error ? "error" : "success");
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
  }, [page, limit]);


    const handleOpenEmployeeModal = (employee) => {
    console.log("Opening modal for employee:", employee);
    setSelectedEmployee(employee);
    setShowModal(true);
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
          BodyNumber={totalAllowance}
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
        else if (searchBy === "client_partner") payload.client_partner = currentValue;
        else if (searchBy === "clients") payload.clients = [currentValue];
      } else {
        delete payload.emp_id;
        delete payload.client_partner;
        delete payload.clients;
      }

      setPage(0);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Typography variant="body2">Page {page + 1}</Typography>

        <Stack direction="row" spacing={1}>
          <Button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>

          <Button
            disabled={(page + 1) * limit >= totalCount}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </Stack>
      </Box>

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
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                size="small"
                onClick={() => downloadErrorExcel(errorFileLink)}
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
