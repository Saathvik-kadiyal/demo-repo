import { useEffect, useState } from "react";
import DataTable from "../component/DataTable.jsx";
import {
  Box,
  Button,
  Typography,
  Stack,
  Modal,
  Paper,
  IconButton,
  CircularProgress,
} from "@mui/material";

import { X, Pencil } from "lucide-react";
import arrow from "../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
import ActionButton from "../component/buttons/ActionButton";

import { useEmployeeData, UI_HEADERS } from "../hooks/useEmployeeData.jsx";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
// import success from "../assets/success.svg";
import successIcon from "../assets/success.svg";




const FileInput = () => {
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupSeverity, setPopupSeverity] = useState("success");

  const {
    rows,
    setRows,
    error,
    errorFileLink,
    setErrorFileLink,
    errorRows,
    totalRecords,
    getProcessedData,
    fetchDataFromBackend,
    downloadExcel,
    downloadErrorExcel,
    success,
  } = useEmployeeData();

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   setFileName(file.name);
  //   const token = localStorage.getItem("access_token");
  //   fetchDataFromBackend(file, token);
  //   setTimeout(() => setFileName(null), 3000);
  // };

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

  const handleFetchPage = async (filters) => {
    setTableLoading(true);
    try {
      await getProcessedData(filters);
    } finally {
      setTableLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setTableLoading(true);
      await downloadExcel();
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    if (errorFileLink) {
      // setPopupMessage("File uploaded with errors. Please review.");
      //  setPopupSeverity("error");
      //  setPopupOpen(true);

      setErrorModalOpen(true);
    }
  }, [errorFileLink]);

  // 🔹 Success popup
  useEffect(() => {
    if (success) {
      setPopupMessage(success);
      setPopupSeverity("success");
      setPopupOpen(true);
    }
  }, [success]);

  // 🔹 Error popup
  useEffect(() => {
    if (error && !errorFileLink) {
      setPopupMessage(error);
      setPopupSeverity("error");
      setPopupOpen(true);
    }
  }, [error]);

  // useEffect(() => {
  //   getProcessedData();
  // }, []);

  const safeErrorRows = errorRows || [];

  return (
    <Box sx={{ width: "100%", pt: 2, pb: 4, px: 2, position: "relative", overflowY: tableLoading ? "hidden" : "auto", height: tableLoading ? "400" : "100%" }}>
      {tableLoading && (
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
            height: "100%"
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

      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        {/* Left: Back Arrow + Title */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer" }}
        >
          <img src={arrow} alt="back" style={{ width: 16, height: 16 }} />
          <Typography
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: 1,
              letterSpacing: "0%",
              color: "#000000",
            }}
          >
            Shift Allowances Data
          </Typography>
        </Box>

        {/* Right: Action Buttons */}
        <Stack direction="row" spacing={1} alignItems="center">
          <ActionButton
            content={() => (
              <Button
                variant="contained"
                component="label"
                sx={{ backgroundColor: "#1C2F72",
            width: 110,
            height: 36,
            padding: "8px 16px",
            borderRadius: 1,
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            "&:hover": { backgroundColor: "#16235B" },}}
              >
                
                Upload File
                <input
                  type="file"
                  hidden
                  onClick={(e) => (e.target.value = null)}
                  onChange={handleFileChange}
                />
              </Button>
            )}
          />
          <Button
    //  onClick={handleExportData} 
    sx={{
      height: 36,
      padding: "8px 16px",
      borderRadius: 1,
      textTransform: "none",
      color: "#fff", 
      backgroundColor: "#1C2F72", 
      "&:hover": { backgroundColor: "#16235B" },
    }}
  >
    Export Data
  </Button>
          

          <Button
            
            onClick={handleDownloadTemplate}
            disabled={tableLoading}
            sx={{
        height: 36,
        padding: "8px 16px",
        borderRadius: 1,
        textTransform: "none",
        color: "var(--Info-80, #0F3C70)",
      }}
          >
            Download Templete

          </Button>
        </Stack>
      </Box>


      <Modal
        open={errorModalOpen}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;

          setErrorModalOpen(false);
          setErrorFileLink && setErrorFileLink(null);
        }}
      >
        <Paper
          sx={{
            width: "60%",
            maxWidth: 600,
            p: 3,
            mx: "auto",
            mt: "10vh",
            overflow: "auto",
            position: "relative",
            borderRadius: 2,
            border: "2px solid #000",
            boxShadow: "none",
            backgroundColor: "#fff",
          }}
        >
          <IconButton
            sx={{ position: "absolute", right: 12, top: 12 }}
            onClick={() => {
              setErrorModalOpen(false);
              setErrorFileLink && setErrorFileLink(null);
            }}
          >
            <X size={20} />
          </IconButton>

          <Typography
            variant="h6"
            mb={2}
            sx={{ color: "red", fontWeight: 600 }}
          >
            File Processed with Errors
          </Typography>

          <Stack direction="column" spacing={2} mb={2}>
            {safeErrorRows.length > 0 && (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<Pencil size={18} />}
                  onClick={() => {
                    navigate("/shift-allowance/edit", {
                      state: { errorRows: safeErrorRows },
                    });
                    setErrorModalOpen(false);
                  }}
                  sx={{ textTransform: "none" }}
                >
                  Edit
                </Button>

                {errorFileLink && (
                  <Button
                    variant="outlined"
                    onClick={() => downloadErrorExcel(errorFileLink)}
                    sx={{ textTransform: "none" }}
                  >
                    Download Error File
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </Paper>
      </Modal>

      {/* 🔹 Data Table */}
      {/* <DataTable
        headers={UI_HEADERS}
        rows={rows || []}
        totalRecords={totalRecords || 0}
        fetchPage={getProcessedData}
      /> */}

      <Box sx={{ position: "relative" }}>
        <DataTable headers={UI_HEADERS} setTableLoading={setTableLoading} />
      </Box>

      {popupOpen && (
        <>
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
              maxWidth: 400,
              borderRadius: 2,
              backgroundColor: "#fff",
              color: popupSeverity === "error" ? "red" : "green",
              border:
                popupSeverity === "error"
                  ? "2px solid #ef4444"
                  : "2px solid #22c55e",

              boxShadow:
                popupSeverity === "error"
                  ? "0 0 12px rgba(239,68,68,0.45)"
                  : "0 0 12px rgba(34,197,94,0.45)",
              zIndex: 3000,
              // boxShadow: 5,
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
              onClick={() => setPopupOpen(false)}
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
      

    </Box>
  );
};

export default FileInput;
