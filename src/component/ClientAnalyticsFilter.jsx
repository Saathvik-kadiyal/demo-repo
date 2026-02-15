import React, { useState } from "react";
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { X } from "lucide-react";

const DEFAULT_EMPLOYEE_NAMES = [
  "Roche",
  "ILC Dover",
  "Equinox",
  "iPAAS Ai",
  "QualTest",
  "Data IQ",
];

const DEFAULT_EMPLOYEE_IDS = [
  "0917SH76",
  "0917SH77",
  "0917SY96",
  "0817HT53",
  "0917SH55",
  "0917SH87",
];

const DEFAULT_ALLOWANCE_RANGES = [
  "$100 - $500",
  "$500 - $1000",
  "$1000 - $5000",
  "$5000 - $10,000",
  "$10,000 - $50,000",
];

const DEFAULT_DEPARTMENTS = [
  "IT - Infra Operation",
  "Networking",
  "UX",
  "Data",
  "Sales",
];

const DEFAULT_HEADCOUNT_RANGES = [
  "1 - 5",
  "5 - 10",
  "10 - 15",
  "15 - 20",
];

/**
 * Right-side filter panel for Client Analytics / Employee Details,
 * matching the Figma design (vertical tabs + section content).
 *
 * This component is UI-focused. It manages its own internal selection state
 * and returns the final filters via onApply().
 */
export default function ClientAnalyticsFilter({
  open,
  onClose,
  onApply,
  employeeNames = DEFAULT_EMPLOYEE_NAMES,
  employeeIds = DEFAULT_EMPLOYEE_IDS,
  allowanceRanges = DEFAULT_ALLOWANCE_RANGES,
  departments = DEFAULT_DEPARTMENTS,
  headcountRanges = DEFAULT_HEADCOUNT_RANGES,
}) {
  const [activeSection, setActiveSection] = useState("Employee Name");

  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
  const [employeeNameSearch, setEmployeeNameSearch] = useState("");

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonths, setSelectedMonths] = useState("");

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [employeeIdSearch, setEmployeeIdSearch] = useState("");

  const [selectedAllowanceRanges, setSelectedAllowanceRanges] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedHeadcountRanges, setSelectedHeadcountRanges] = useState([]);

  const sections = [
    "Employee Name",
    "Period",
    "Employee ID",
    "Allowances",
    "Departments",
    "Headcounts",
  ];

  const toggleInArray = (value, setFn) => {
    setFn((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApply = () => {
    const filters = {
      employeeNames: selectedEmployeeNames,
      period: {
        year: selectedYear,
        months: selectedMonths,
      },
      employeeIds: selectedEmployeeIds,
      allowances: selectedAllowanceRanges,
      departments: selectedDepartments,
      headcounts: selectedHeadcountRanges,
    };

    onApply?.(filters);
    onClose?.();
  };

  const handleClearAll = () => {
    setSelectedEmployeeNames([]);
    setEmployeeNameSearch("");
    setSelectedYear("");
    setSelectedMonths("");
    setSelectedEmployeeIds([]);
    setEmployeeIdSearch("");
    setSelectedAllowanceRanges([]);
    setSelectedDepartments([]);
    setSelectedHeadcountRanges([]);
  };

  const filteredEmployeeNames = employeeNames.filter((name) =>
    name.toLowerCase().includes(employeeNameSearch.toLowerCase())
  );

  const filteredEmployeeIds = employeeIds.filter((id) =>
    id.toLowerCase().includes(employeeIdSearch.toLowerCase())
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case "Employee Name":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search clients..."
              value={employeeNameSearch}
              onChange={(e) => setEmployeeNameSearch(e.target.value)}
            />
            <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
              {filteredEmployeeNames.map((name) => (
                <FormControlLabel
                  key={name}
                  control={
                    <Checkbox
                      checked={selectedEmployeeNames.includes(name)}
                      onChange={() =>
                        toggleInArray(name, setSelectedEmployeeNames)
                      }
                    />
                  }
                  label={name}
                  sx={{ display: "block", mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        );

      case "Period":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography fontWeight={600}>Select Range</Typography>
            <TextField
              size="small"
              label="Select Year"
              placeholder="2026"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            />
            <TextField
              size="small"
              label="Select Months"
              placeholder="Jan, Feb, May"
              helperText="Comma-separated months"
              value={selectedMonths}
              onChange={(e) => setSelectedMonths(e.target.value)}
            />
          </Box>
        );

      case "Employee ID":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search Employee Id..."
              value={employeeIdSearch}
              onChange={(e) => setEmployeeIdSearch(e.target.value)}
            />
            <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
              {filteredEmployeeIds.map((id) => (
                <FormControlLabel
                  key={id}
                  control={
                    <Checkbox
                      checked={selectedEmployeeIds.includes(id)}
                      onChange={() => toggleInArray(id, setSelectedEmployeeIds)}
                    />
                  }
                  label={id}
                  sx={{ display: "block", mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>
        );

      case "Allowances":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {allowanceRanges.map((range) => (
              <FormControlLabel
                key={range}
                control={
                  <Checkbox
                    checked={selectedAllowanceRanges.includes(range)}
                    onChange={() =>
                      toggleInArray(range, setSelectedAllowanceRanges)
                    }
                  />
                }
                label={range}
                sx={{ display: "block", mb: 0.5 }}
              />
            ))}
          </Box>
        );

      case "Departments":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {departments.map((dept) => (
              <FormControlLabel
                key={dept}
                control={
                  <Checkbox
                    checked={selectedDepartments.includes(dept)}
                    onChange={() => toggleInArray(dept, setSelectedDepartments)}
                  />
                }
                label={dept}
                sx={{ display: "block", mb: 0.5 }}
              />
            ))}
          </Box>
        );

      case "Headcounts":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {headcountRanges.map((range) => (
              <FormControlLabel
                key={range}
                control={
                  <Checkbox
                    checked={selectedHeadcountRanges.includes(range)}
                    onChange={() =>
                      toggleInArray(range, setSelectedHeadcountRanges)
                    }
                  />
                }
                label={range}
                sx={{ display: "block", mb: 0.5 }}
              />
            ))}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 360,
          p: 2,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography fontWeight={600}>Filter</Typography>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Left sections list */}
        <Box
          sx={{
            width: 140,
            borderRight: "1px solid #e5e7eb",
            pr: 1,
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          }}
        >
          {sections.map((section) => {
            const isActive = activeSection === section;
            return (
              <Box
                key={section}
                onClick={() => setActiveSection(section)}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive ? "#eff6ff" : "transparent",
                  color: isActive ? "#1d4ed8" : "#374151",
                }}
              >
                {section}
              </Box>
            );
          })}
        </Box>

        {/* Right content */}
        <Box sx={{ flex: 1, pl: 2, overflowY: "auto" }}>{renderSectionContent()}</Box>
      </Box>

      {/* Footer actions */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button variant="text" color="inherit" onClick={handleClearAll}>
          Clear all
        </Button>
        <Button variant="contained" onClick={handleApply}>
          Apply
        </Button>
      </Box>
    </Drawer>
  );
}

