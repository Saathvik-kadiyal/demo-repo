import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Modal,
  Breadcrumbs,
  Link,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Pen, X } from "lucide-react";
import * as XLSX from "xlsx";
import { correctEmployeeRows } from "../utils/helper";
import arrow from "../assets/arrow.svg";
import ErrorTable from "../component/ErrorTable.tsx";
 
 
 
const BACKEND_TO_FRONTEND = {
  emp_id: "EMP ID",
  emp_name: "EMP NAME",
  grade: "GRADE",
  department: "DEPARTMENT",
  client: "CLIENT",
  project: "PROJECT",
  project_code: "PROJECT CODE",
};
 
const HIDDEN_FIELDS = ["reason"];
const isHiddenField = (key) => HIDDEN_FIELDS.includes(key);
 
const EmployeeEditPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
 
  const [errorRows, setErrorRows] = useState(state?.errorRows || []);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [saveError, setSaveError] = useState("");
  const [clearedErrors, setClearedErrors] = useState({});
 
 
  const TEXT_FIELDS = ["payroll_month", "duration_month"];
  const NUMBER_FIELDS = [
  "PST_MST",
  "US_INDIA",
  "SG",
  "ANZ",
  "total_days",
  "Timesheet Billable Days",
  "Timesheet Non Billable Days",
  "Final Total Days",
];

 
  const isFieldInvalid = (field, value) => {
    if (selectedEmployee?.reason?.[field]) return true;
    if (value === "" || value === undefined) return true;
    if (TEXT_FIELDS.includes(field)) return false;
    return isNaN(Number(value)) || Number(value) < 0;
  };
 
 
  useEffect(() => {
    if (selectedEmployee) {
      const fieldsToEdit = {};
      Object.keys(selectedEmployee).forEach((key) => {
        if (!isHiddenField(key)) {
          fieldsToEdit[key] = selectedEmployee[key];
        }
      });
      setEditedFields(fieldsToEdit);
      setSaveError("");
    } else {
      setEditedFields({});
    }
  }, [selectedEmployee]);
 
const handleSave = async () => {
  if (!selectedEmployee) return;

  const token = localStorage.getItem("access_token");
  if (!token) {
    setPopupMessage("You are not authenticated. Please login again.");
    setPopupType("error");
    setPopupOpen(true);
    return;
  }

  try {
    // 🧩 Merge base + edited values
    const row = {
      ...selectedEmployee,
      ...editedFields,
    };

    // 🔢 Shift days (MANDATORY)
    const shiftDays = {
      PST_MST: Number(row.PST_MST) || 0,
      US_INDIA: Number(row.US_INDIA) || 0,
      SG: Number(row.SG) || 0,
      ANZ: Number(row.ANZ) || 0,
    };

    const totalDays =
      shiftDays.PST_MST +
      shiftDays.US_INDIA +
      shiftDays.SG +
      shiftDays.ANZ;

    if (totalDays <= 0) {
      setSaveError("At least one shift day must be greater than 0");
      return;
    }

    // 💰 Shift allowances (map exactly what backend expects)
    const shiftAllowances = {
      PST_MST_ALLOWANCE: Number(row["PST/ MST  Allowances"]) || 0,
      US_INDIA_ALLOWANCE: Number(row["US/India\nAllowances"]) || 0,
      SG_ALLOWANCE: Number(row["SG – Singapore Allowances"]) || 0,
      ANZ_ALLOWANCE:
        Number(row["ANZ – Australia New Zealand\n Allowances"]) || 0,
    };

    // 📦 FINAL BACKEND PAYLOAD
    const payload = {
      corrected_rows: [
        {
          emp_id: row.emp_id,
          emp_name: row.emp_name,
          grade: row.grade,
          "Current Status(e)": row.current_status,
          department: row.department,
          client: row.client,
          project: row.project,
          project_code: row.project_code,
          client_partner: row.client_partner,
          practice_lead: row.practice_lead,
          delivery_manager: Number(row.delivery_manager) || 0,
          duration_month: row.duration_month,
          payroll_month: row.payroll_month,

          shift_days: shiftDays,
          shift_allowances: shiftAllowances,

          total_days: totalDays,
          total_days_allowances:
            Object.values(shiftAllowances).reduce((a, b) => a + b, 0),

          timesheet_billable_days:
            Number(row["Timesheet Billable Days"]) || 0,
          timesheet_non_billable_days:
            Number(row["Timesheet Non Billable Days"]) || 0,

          diff: Number(row.Diff) || 0,
          final_total_days: totalDays,
          billability_status: row.billability_status,

          practice_remarks: Number(row.practice_remarks) || 0,
          rmg_comments: Number(row.rmg_comments) || 0,
          amar_approval: Number(row["Amar Approval"]) || 0,
          am_email_attempt: row["AM Email Attempt(e)"],
          am_approval_status: Number(row["AM Approval Status(e)"]) || 0,
        },
      ],
    };

    console.log("🚀 Final backend payload:", payload);

    const data = await correctEmployeeRows(payload);

    setPopupMessage(`EMP ID: ${row.emp_id} - ${data.message}`);
    setPopupType("success");
    setPopupOpen(true);

    setErrorRows((prev) =>
      prev.filter((r) => r.emp_id !== row.emp_id)
    );

    setTimeout(() => setSelectedEmployee(null), 1000);
  } catch (err) {
    const errorMsg =
      err?.detail?.failed_rows?.[0]?.reason ||
      err?.message ||
      "Unknown error";

    setSaveError(
      `Failed to save EMP ID: ${selectedEmployee.emp_id} - ${errorMsg}`
    );
  }
};




 
  const handleDownloadErrorRows = () => {
    if (!errorRows || errorRows.length === 0) return;
 
    const cleanedRows = errorRows.map(({ reason, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(cleanedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Error Rows");
    XLSX.writeFile(workbook, "Remaining_Error_Rows.xlsx");
  };
 
  const handleChangePage = (event, newPage) => setPage(newPage);
 
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 
  const isSaveDisabled = selectedEmployee
    ? Object.keys(selectedEmployee.reason || {}).some((field) => {
      const value = editedFields[field];
      if (value === "" || value === undefined) return true;
      if (TEXT_FIELDS.includes(field)) return false;
      return isNaN(Number(value)) || Number(value) < 0;
    })
    : true;
 
  return (
 
    <Box sx={{ p: 3, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
 
 
 
      <Box display="flex" alignItems="center" gap={0.5} sx={{ mb: 3 }}>
        {/* Back arrow */}
        <img src={arrow} alt="back" style={{ width: 16, height: 16 }} />
 
        {/* Shift Allowance */}
        <Typography
          onClick={() => navigate("/shift-allowance")}
          sx={{
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Shift Allowance Data
        </Typography>
 
        {/* Separator */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#6B7280",
            mx: 0.5,
          }}
        >
          /
        </Typography>
 
        {/* Current page */}
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 500,
            color: "#111827",
          }}
        >
          Error Records
        </Typography>
      </Box>
< ErrorTable
  rows={errorRows}
  page={page}
  rowsPerPage={rowsPerPage}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
  onEdit={(row) => {
    setSelectedEmployee(row);
    setPopupMessage("");
    setPopupOpen(false);
    setSaveError("");
  }}
  isHiddenField={isHiddenField}
  headerMap={BACKEND_TO_FRONTEND}
/>
 
 
 
 
     
 
      {/* Modal for editing employee */}
      <Modal
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        BackdropProps={{
          style: { backgroundColor: "rgba(0,0,0,0.5)" },
          onClick: (e) => e.stopPropagation(),
        }}
      >
        <Paper
          sx={{
            width: "70%",
            maxWidth: 900,
            maxHeight: "80vh",
            p: 3,
            mx: "auto",
            mt: "10vh",
            overflowY: "auto",
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Employee Details – EMP ID: {selectedEmployee?.emp_id}
            </Typography>
 
            <IconButton
              onClick={() => {
                setSelectedEmployee(null);
                setPopupMessage("");
                setPopupOpen(false);
              }}
            >
              <X size={20} />
            </IconButton>
 
          </Box>
 
          <Typography fontWeight="bold" mb={1}>
            Edit Error Fields
          </Typography>
 
          {/* Display non-error fields */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {selectedEmployee &&
              Object.entries(selectedEmployee).map(([key, value]) => {
                if (isHiddenField(key) || key in selectedEmployee.reason)
                  return null;
                return (
                  <Paper key={key} sx={{ p: 2, flex: "1 1 calc(45% - 12px)" }}>
                    <Typography fontWeight="bold">
                      {BACKEND_TO_FRONTEND[key] || key.toUpperCase()}
                    </Typography>
                    <Typography>{value ?? "-"}</Typography>
                  </Paper>
                );
              })}
          </Box>
 
          {/* Display error fields for editing */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {selectedEmployee &&
              Object.keys(selectedEmployee.reason || {}).map((field) => (
                <Paper key={field} sx={{ p: 2, flex: "1 1 45%" }}>
                  <Typography fontWeight="bold">
                    {field.replace(/_/g, " ").toUpperCase()}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type={TEXT_FIELDS.includes(field) ? "text" : "number"}
                    inputProps={TEXT_FIELDS.includes(field) ? {} : { min: 0 }}
                    value={editedFields[field] ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditedFields((prev) => ({ ...prev, [field]: value }));
 
                      let isValid = false;
                      if (TEXT_FIELDS.includes(field)) {
                        isValid = value.trim() !== "";
                      } else {
                        const num = Number(value);
                        isValid = !isNaN(num) && num >= 0;
                      }
 
 
                      if (isValid) {
                        setClearedErrors((prev) => ({
                          ...prev,
                          [field]: true,
                        }));
                      }
                    }}
 
                    error={
                      !!selectedEmployee?.reason?.[field] && !clearedErrors[field]
                    }
                    helperText={
                      !clearedErrors[field] ? selectedEmployee?.reason?.[field] : ""
                    }
 
                  />
                </Paper>
              ))}
          </Box>
 
          <Box mt={3} display="flex" flexDirection="column" gap={1}>
            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaveDisabled}
              >
                Save
              </Button>
              <Button variant="outlined" onClick={() => setSelectedEmployee(null)}>
                Back
              </Button>
            </Box>
 
            {/* Error message below Save button */}
            {saveError && (
              <Typography color="error" variant="body2">
                {saveError}
              </Typography>
            )}
          </Box>
        </Paper>
      </Modal>
 
      {/* Popup modal for success messages */}
      <Modal
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        BackdropProps={{ style: { backgroundColor: "rgba(0,0,0,0.3)" } }}
        aria-labelledby="popup-message"
        aria-describedby="popup-description"
      >
        <Paper
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            p: 4,
            width: { xs: "80%", sm: 400 },
            textAlign: "center",
            borderRadius: 2,
            maxHeight: "70vh",
            overflowY: "auto",
 
            border: popupType === "success"
              ? "2px solid #16a34a"
              : "2px solid #dc2626",
 
 
            boxShadow:
              popupType === "success"
                ? "0 0 10px rgba(22,163,74,0.4)"
                : "0 0 10px rgba(220,38,38,0.4)",
 
          }}
        >
          <Typography
            id="popup-message"
            sx={{
              color: popupType === "success" ? "green" : "red",
              fontWeight: "bold",
              mb: 2,
              wordBreak: "break-word",
            }}
            variant="h6"
          >
            {popupMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setPopupOpen(false)}
            sx={{
              mt: 1,
              backgroundColor: "#1E3A8A",
              "&:hover": { backgroundColor: "#17326c" },
            }}
          >
            Close
          </Button>
        </Paper>
      </Modal>
    </Box>
  );
};
 
export default EmployeeEditPage;
 
 
 
 
 