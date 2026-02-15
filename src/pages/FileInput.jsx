import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Button, Stack, Typography, CircularProgress } from "@mui/material";
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

const FileInput = () => {
  const navigate = useNavigate();

  const [fileName, setFileName] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchBy, setSearchBy] = useState("emp_id");
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

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
    shiftSummary
  } = useEmployeeData();

  const safeErrorRows = errorRows || [];
  const tableData = mapEmployeeForTable(rows);
  



  // -------------------
  // 🔹 Fetch data
  // -------------------
  const runFetch = useCallback(async (payloadFilters) => {
    setTableLoading(true);
    try {
      const payload = normalizeFilters(payloadFilters);
      console.log("Fetching data with payload:", payload);
      await getProcessedData(payload);
    } finally {
      setTableLoading(false);
    }
  }, [getProcessedData]);

  useEffect(() => {
    runFetch({ start: 0, limit: 10 });
  }, [runFetch]);

  // -------------------
  // 🔹 Apply Filters
  // -------------------
  const handleApplyFilters = (filtersObj) => {
    setFilters(filtersObj);

    const payload = { ...filtersObj };

    // Search overrides
    if (searchText) {
      if (searchBy === "emp_id") payload.emp_id = [searchText];
      else if (searchBy === "clients") payload.clients = [searchText];
      else if (searchBy === "client_partner") payload.client_partner = [searchText];
    }

    runFetch(payload);
  };

  // -------------------
  // 🔹 Search input
  // -------------------
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const payload = { ...filters };
    if (searchBy === "emp_id") payload.emp_id = [value];
    else if (searchBy === "clients") payload.clients = [value];
    else if (searchBy === "client_partner") payload.client_partner = [value];

    runFetch(payload);
  };

  // -------------------
  // 🔹 File Upload
  // -------------------
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setTableLoading(true);
    const token = localStorage.getItem("access_token");

    try {
      await fetchDataFromBackend(file, token);
    } finally {
      setTableLoading(false);
      setTimeout(() => setFileName(null), 3000);
    }
  };

  // -------------------
  // 🔹 Employee Modal
  // -------------------
  const handleOpenEmployeeModal = (employee) => {
    console.log("Opening modal for employee:", employee);
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  // -------------------
  // 🔹 Download Template
  // -------------------
  const handleDownloadTemplate = async () => {
    setTableLoading(true);
    try {
      await downloadExcel();
    } finally {
      setTableLoading(false);
    }
  };

  // -------------------
  // 🔹 Popups
  // -------------------
  useEffect(() => {
    if (errorFileLink) {
      setPopupMessage("File processed with errors. Please review.");
      setPopupSeverity("error");
      setPopupOpen(true);
    } else if (error) {
      setPopupMessage(error);
      setPopupSeverity("error");
      setPopupOpen(true);
    } else if (success) {
      setPopupMessage(success);
      setPopupSeverity("success");
      setPopupOpen(true);
    }
  }, [errorFileLink, error, success]);


  useEffect(() => {
  if (popupMessage) {
    setPopupOpen(true);
    const timer = setTimeout(() => setPopupOpen(false), 4000);
    return () => clearTimeout(timer);
  }
}, [popupMessage]);

  // -------------------
  // 🔹 KPI Cards
  // -------------------

  // rows is your table data
const totalAllowance = shiftSummary?.total||0;
console.log("Total Allowance:", shiftSummary);

const shiftTotals = Object.fromEntries(
  Object.entries(shiftSummary || {}).filter(
    ([key]) => !["total", "head_count", "headcount"].includes(key)
  )
);


const shiftKpiCards = Object.entries(shiftTotals).map(([shiftKey, value]) => ({
  ShiftType: shiftKey,
  ShiftCount: value,
  ShiftCountSize: "2rem",
  ShiftTypeSize: "1rem",
}));




  return (
    <Box sx={{ width: "100%", pt: 2, pb: 4, px: 2, position: "relative" }}>
      {tableLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}

      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={1} onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
          <img src={arrow} alt="back" style={{ width: 16, height: 16 }} />
          <Typography fontWeight={500} fontSize={16}>Shift Allowances Data</Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <ActionButton
            content={() => (
              <Button variant="contained" component="label" sx={{ backgroundColor: "#1C2F72" }}>
                Upload File
                <input type="file" hidden onClick={e => (e.target.value = null)} onChange={handleFileChange} />
              </Button>
            )}
          />
          <Button sx={{ backgroundColor: "#1C2F72", color: "#fff" }} onClick={handleDownloadTemplate}>
            Download Template
          </Button>
        </Stack>
      </Box>

      {/* KPI Cards */}
      <Box sx={{ display: "flex", gap: 2, mb: 6, flexWrap: "wrap" }}>
<KpiCard HeaderIcon={allowanceIcon} HeaderText="Total Allowance" BodyNumber={totalAllowance} />
{shiftKpiCards.map((card, idx) => (
  <ShiftKpiCard
    key={idx}
    ShiftType={card.ShiftType}
    ShiftCount={card.ShiftCount}
    ShiftCountSize={card.ShiftCountSize}
    ShiftTypeSize={card.ShiftTypeSize}
  />
))}

</Box>


      {/* Search + Filter */}
      <Box display="flex" gap={2} mb={3} alignItems="center" justifyContent="flex-end">
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearchChange}
          style={{ padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db" }}
        />
        <select value={searchBy} onChange={e => setSearchBy(e.target.value)} style={{ padding: "9px 15px", borderRadius: 7 }}>
          <option value="emp_id">Employee ID</option>
          <option value="clients">Clients</option>
          <option value="client_partner">Client Partner</option>
        </select>

 <FilterDrawer
        onApply={handleApplyFilters}
        filters={filters}
      />
      </Box>

     

      {/* Data Table */}
      <ReusableTable
        data={tableData}
        columns={allowanceColumns}
        getRowKey={row => row.emp_id}
        onActionClick={handleOpenEmployeeModal}
      />

      {showModal && selectedEmployee && (
  <EmployeeModal
    employee={selectedEmployee}
    onClose={() => setShowModal(false)}
    setPopupMessage={setPopupMessage}
    setPopupType={setPopupSeverity}
  />
)}


      {/* Popup */}
      <PopupMessage
        open={popupOpen}
        message={popupMessage}
        severity={popupSeverity}
        onClose={() => setPopupOpen(false)}
        actions={popupSeverity === "error" && errorFileLink ? (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate("/shift-allowance/edit", { state: { errorRows: safeErrorRows } })}
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
        ) : null}
      />
    </Box>
  );
};

export default FileInput;
