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
} from "@mui/material";
import { Pen, ChevronRight } from "lucide-react";
 
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
 
  return (
    <>
      <Box>
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
              zIndex: 4,
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
                        {/* Info Icon */}
                        <TableCell sx={{ textAlign: "center" }}>
                          {hasErrors && (
                            <Tooltip
                              open={expandedRowIdx === actualIndex}
                              onClose={() => setExpandedRowIdx(null)}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              placement="right"
                              arrow
                              disablePortal
                              title={
                                <Box>
                                  <Typography sx={{ fontSize: 12 }}>
                                    {Object.entries(row.reason)
                                      .map(
                                        ([key, val]) =>
                                          `${key}: ${val}`
                                      )
                                      .join(", ")}
                                  </Typography>
 
                                  <Typography
                                    sx={{
                                      color: "#253D8D",
                                      cursor: "pointer",
                                      fontWeight: 500,
                                      fontSize: 12,
                                      mt: 0.5,
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const firstErrorKey =
                                        Object.keys(row.reason)[0];
                                      const cell =
                                        document.getElementById(
                                          `cell-${row.emp_id}-${firstErrorKey}`
                                        );
                                      if (cell) {
                                        cell.scrollIntoView({
                                          behavior: "smooth",
                                          block: "center",
                                        });
                                      }
                                      setExpandedRowIdx(null);
                                    }}
                                  >
                                    Check Details →
                                  </Typography>
                                </Box>
                              }
                            >
                              <ChevronRight
                                size={18}
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  setExpandedRowIdx(
                                    expandedRowIdx === actualIndex
                                      ? null
                                      : actualIndex
                                  )
                                }
                              />
                            </Tooltip>
                          )}
                        </TableCell>
 
                        {/* Data Cells */}
                        {Object.keys(row)
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
 
 