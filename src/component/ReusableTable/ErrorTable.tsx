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
} from "@mui/material";
import { Pen } from "lucide-react";

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

const  ErrorTable: React.FC<EditTableProps> = ({
  rows,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  isHiddenField,
  headerMap,
}) => {
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 400,
          borderRadius: 1,
          boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Table title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "12px",
                  lineHeight: "12px",
                  letterSpacing: "0",
                  color: "#1A1A1A",
                  borderBottom: "1px solid #E5E7EB",

                },
              }}
            >
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
                .map((row, idx) => (
                  <TableRow key={idx}
                    sx={{
                      "& td": {
                        fontFamily: "Poppins",
                        fontWeight: 400,
                        fontSize: "12px",
                        lineHeight: "12px",
                        letterSpacing: "0",
                        color: "#1A1A1A",
                        py: 1.5,

                        borderBottom: "1px solid #E5E7EB",
                      },
                    }}

                  >
                  

                    {Object.keys(row)
                      .filter((key) => !isHiddenField(key))
                      .map((key: string) => (
                        <TableCell
                          key={key}
                          sx={{
                            fontFamily: "Poppins",
                            fontSize: "12px",
                            fontWeight: 400,
                            lineHeight: "12px",
                            letterSpacing: "0",
                            color: "#1A1A1A",
                            py: 1.5, // row height control
                            borderBottom: "1px solid #E5E7EB",
                          }}
                        >
                          {key === "Current Status(e)" && row[key] === "Active" ? (
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                height: "24px",
                                px: "12px",
                                borderRadius: "6px",
                                backgroundColor: "var(--Info-20, #BCD6F6)",
                                color: "var(--Info-Main, #3183E3)",
                                fontFamily: "Poppins",
                                fontSize: "12px",
                                fontWeight: 500,
                                lineHeight: "12px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              Active
                            </Box>
                          ) : (
                            String(row[key] ?? "-")
                          )}
                        </TableCell>
                      ))}

                    <TableCell>
                      <IconButton size="small" onClick={() => onEdit(row)}>
                        <Pen size={16} />
                      </IconButton>
                    </TableCell>


                  </TableRow>
                ))
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
    </>
  );
};

export default  ErrorTable;
