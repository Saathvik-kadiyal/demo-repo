import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Pen, ChevronRight } from "lucide-react";
import infoIcon from "../assets/info.svg"
import arrowright from "../assets/arrowright.svg";
import * as XLSX from "xlsx";
 
type EditTableProps = {
  rows: any[];
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: (row: any) => void;
  isHiddenField: (key: string) => boolean;
  headerMap: Record<string, string>;
};

const StatusChip = ({ status }: { status: string }) => {
  const isActive = status?.toLowerCase() === "active";
 
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 24,
        px: 2,
        borderRadius: "999px",
        backgroundColor: isActive ? "#BCD6F6" : "#FEE2E2",
        color: isActive ? "#3183E3" : "#B91C1C",
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </Box>
  );
};
 
 

const ErrorTable: React.FC<EditTableProps> = ({
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  isHiddenField,
  headerMap,
}) => {
  const [expandedRowIdx, setExpandedRowIdx] = useState<number | null>(null);

const handleDownloadErrorRows = () => {
 
  if (!rows || rows.length === 0) return;
 
  const formattedRows = rows.map((row) => ({
    ...row,
    reason: row.reason
      ? Object.entries(row.reason)
          .map(([key, val]) => `${key}: ${val}`)
          .join(", ")
      : "",
  }));
 

 
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Error Rows");
  XLSX.writeFile(workbook, "Remaining_Error_Rows.xlsx");
};
 
 
 

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1, mt: -4 }}>
          <Button
            variant="text"
            onClick={handleDownloadErrorRows}
            disabled={rows.length === 0}
            sx={{
              color: "#092443",
              textTransform: "none",
              padding: 0,
              minWidth: 0,
    fontWeight: 500,
    cursor: "pointer",
   
    // "&:disabled": {
    //   color: "#a0a0a0",
    //   cursor: "default",
    //   textDecoration: "none",
    // },
  }}
>
  Download Template
</Button>
</Box>
 
 
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 400,
            borderRadius: 1,
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            overflow: "auto",
          }}
        >
          {/* Sticky Title */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              left: 0,
              right: 0,
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          >
            <Typography fontWeight={700} fontSize="16px" color="#092443">
              Error Records
            </Typography>
          </Box>

          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    backgroundColor: "#E9F1FC",
                    fontWeight: 500,
                    fontSize: "12px",
                    borderBottom: "1px solid #E5E7EB",
                    position: "sticky",
                    top: "48px",
                    zIndex: 3,
                  },
                }}
              >
                <TableCell sx={{ width: 50, textAlign: "center" }}>
                  Info
                </TableCell>

                {Object.keys(rows[0] || {})
                  .filter((key) => !isHiddenField(key))
                  .map((key) => (
                    <TableCell key={key}>
                      {headerMap[key] || key.toUpperCase()}
                    </TableCell>
                  ))}

                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <Typography fontWeight="bold" color="success.main">
                      All rows successfully edited
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, idx) => {
                    const actualIndex = page * rowsPerPage + idx;
                    const hasErrors =
                      row.reason && Object.keys(row.reason).length > 0;

                    return (
                      <TableRow key={idx}>


                        <TableCell sx={{ textAlign: "center", position: "relative" }}>
                          {hasErrors && (
                            <>
                              {/* Info icon */}
                              <Box
                                component="img"
                                src={infoIcon}
                                alt="info"
                                sx={{ width: 18, height: 18, cursor: "pointer" }}
                                onClick={() =>
                                  setExpandedRowIdx(expandedRowIdx === actualIndex ? null : actualIndex)
                                }
                              />


                              {expandedRowIdx === actualIndex && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "110%",
                                    transform: "translateY(-50%)",
                                    width: 454,
                                    height: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0, // 8px
                                    background: "#FCE8E8",
                                    borderLeft: "4px solid var(--Design-System-Error, #EB5757)",
                                    borderRadius: "8px",
                                    padding: "8px 12px ",
                                    boxShadow: "0px 2px 16px 0px #68B0DA0A",
                                    zIndex: 1000,
                                    cursor: "default",
                                  }}
                                >

                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      color: "#000000",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      flex: 1,
                                    }}
                                  >
                                    {Object.entries(row.reason)
                                      .map(([key, val]) => `${key}: ${val}`)
                                      .join(", ")}
                                  </Typography>

                                  <Typography
                                    sx={{
                                      color: "#253D8D",
                                      cursor: "pointer",
                                      fontWeight: 500,
                                      fontSize: 12,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const firstErrorKey = Object.keys(row.reason)[0];
                                      const cell = document.getElementById(
                                        `cell-${row.emp_id}-${firstErrorKey}`
                                      );
                                      if (cell) {
                                        cell.scrollIntoView({ behavior: "smooth", block: "nearest" });
                                        cell.style.backgroundColor = "#FFE5E5";
                                        setTimeout(() => (cell.style.backgroundColor = ""), 1200);
                                      }
                                      setExpandedRowIdx(null);
                                    }}
                                  >
                                    <span> Check Details</span>
                                    <Box
                                      component="img"
                                      src={arrowright}
                                      alt="arrow"
                                      sx={{
                                        wifth: 14,
                                        height: 14,
                                        ml: 0.5,
                                        display: "inline-block"
                                      }}
                                    />

                                  </Typography>
                                </Box>
                              )}
                            </>
                          )}
                        </TableCell>


                        {/* Data Cells */}
                        {/* {Object.keys(row)
                          .filter((key) => !isHiddenField(key))
                          .map((key) => {
                            const isActive =
                              key === "Current_Status" &&
                              row[key] === "Active";

                            const isError =
                              !isActive &&
                              row.reason &&
                              row.reason[key];

                            return (
                              <TableCell
                                key={key}
                                id={`cell-${row.emp_id}-${key}`}
                                sx={{
                                  fontSize: "12px",
                                  pl: 2,
                                  color: isError
                                    ? "#E53935"
                                    : isActive
                                      ? "#3183E3"
                                      : "#1A1A1A",
                                  fontWeight:
                                    isError || isActive ? 500 : 400,
                                }}
                              >
                                {isActive ? (
                                  <Box
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "24px",
                                      px: "12px",
                                      borderRadius: "6px",
                                      backgroundColor: "#BCD6F6",
                                      color: "#3183E3",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Active
                                  </Box>
                                ) : isError ? (
                                  row.reason[key]
                                ) : (
                                  row[key] ?? "-"
                                )}
                              </TableCell>
                            );
                          })} */}

                          {Object.keys(row)
  .filter((key) => !isHiddenField(key))
  .map((key) => {
    const isStatusField = key.toLowerCase() === "current_status";
    const isError = row.reason && row.reason[key];
 
    return (
      <TableCell
        key={key}
        id={`cell-${row.emp_id}-${key}`}
        sx={{
          fontSize: "12px",
          pl: 2,
          color: isError ? "#E53935" : "#1A1A1A",
          fontWeight: isError ? 500 : 400,
        }}
      >
        {isStatusField ? (
          <StatusChip status={row[key]} />
        ) : isError ? (
          row.reason[key]
        ) : (
          row[key] ?? "-"
        )}
      </TableCell>
    );
  })}

                        {/* Edit */}
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => onEdit(row)}
                          >
                            <Pen size={16} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>
    </>
  );
};

export default ErrorTable;


