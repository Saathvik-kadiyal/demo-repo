import { useState, useEffect } from "react";
import { Box, Typography, Paper, TextField, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { correctEmployeeRows } from "../utils/helper.js";

const EDITABLE_FIELDS = ["PST_MST", "US_INDIA", "SG", "ANZ"];
console.log("EmployeeEdit rendered");

const FIELD_LABEL_MAP = {
  PST_MST: "PST / MST",
  US_INDIA: "US / India",
  SG: "Singapore",
  ANZ: "Australia / New Zealand",
};

const BACKEND_TO_FRONTEND = {
  emp_id: "EMP ID",
  emp_name: "EMP NAME",
  grade: "GRADE",
  department: "DEPARTMENT",
  client: "CLIENT",
  project: "PROJECT",
  project_code: "PROJECT CODE",
  reason: "REASON",
};

const EmployeeEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editRow, setEditRow] = useState(location.state?.row || null);
  const [saveSuccess, setSaveSuccess] = useState("");

  if (!editRow) {
    return (
      <Box p={3}>
        <Typography>No employee selected.</Typography>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </Box>
    );
  }

  const handleSave = async () => {
    console.log("Save button clicked");
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // 🔒 FINAL SANITIZATION
    const payload = {
      ...editRow,
      PST_MST: Number(editRow.PST_MST) || 0,
      US_INDIA: Number(editRow.US_INDIA) || 0,
      SG: Number(editRow.SG) || 0,
      ANZ: Number(editRow.ANZ) || 0,
    };
    console.log("Prepared payload for backend:", payload);
    try {
      const data = await correctEmployeeRows([payload]);
      let message = "";

      if (
        data &&
        (data.success === true ||
          (data.message && data.message.toLowerCase().includes("success")))
      ) {
        message = `EMP ID: ${editRow.emp_id} - ${data.message}`;
      } else {
        message = `EMP ID: ${editRow.emp_id} update failed: ${
          data.message || "Unknown error"
        }`;
      }

      setSaveSuccess(message);
    } catch (err) {
      setSaveSuccess(`EMP ID: ${editRow.emp_id} update failed: ${err.message}`);
    }

    setTimeout(() => setSaveSuccess(""), 5000);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        Employee Details dddd– EMP ID: {editRow.emp_id}
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        {Object.entries(editRow).map(([key, value]) => {
          if (!EDITABLE_FIELDS.includes(key)) {
            return (
              <Paper
                key={key}
                sx={{
                  p: 2,
                  flex: "1 1 calc(30% - 16px)",
                  backgroundColor: "#fafafa",
                }}
              >
                <Typography fontWeight={600}>
                  {BACKEND_TO_FRONTEND[key] || key.toUpperCase()}
                </Typography>
                <Typography>{value ?? "-"}</Typography>
              </Paper>
            );
          }
          return null;
        })}
      </Box>

      <Typography variant="h6" mb={1}>
        Edit Shift Days
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {EDITABLE_FIELDS.map((field) => (
          <Paper key={field} sx={{ p: 2, flex: "1 1 calc(25% - 16px)" }}>
            <Typography fontWeight={600}>{FIELD_LABEL_MAP[field]}</Typography>
            <TextField
              fullWidth
              size="small"
              type="number"
              value={editRow[field] ?? 0}
              onChange={(e) => {
                const raw = e.target.value;

                setEditRow((prev) => ({
                  ...prev,
                  [field]: raw === "" ? 0 : parseInt(raw, 10),
                }));
              }}
            />
          </Paper>
        ))}
      </Box>

      <Button  onClick={handleSave}
      sx={{
         mt: 3,
    backgroundColor: "#1E3A8A",
    color: "#fff",
    textTransform: "none", // normal text
    borderRadius: "4px",
    padding: "6px 16px",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#16286b",
    },
      }}>
        Save
      </Button>
 
      {saveSuccess && (
        <Typography color={saveSuccess.includes("successfully") ? "success.main" : "error"} sx={{ mt: 1 }}>
          {saveSuccess}
        </Typography>
      )}
 
      <Button  onClick={() => navigate(-1)}
        sx={{
          mt: 2,
    backgroundColor: "transparent",
    color: "#1E3A8A",
    border: "2px solid #1E3A8A",
    borderRadius: "4px",
    padding: "6px 16px",
    textTransform: "none",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "rgba(28, 47, 114, 0.1)",
    },
        }}>
        Go Back
      </Button>
 
    </Box>
  );
};

export default EmployeeEdit;
