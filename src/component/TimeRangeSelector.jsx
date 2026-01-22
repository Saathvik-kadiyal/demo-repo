import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Info, X } from "lucide-react";

const TimeRangeSelector = ({
  timelineSelection,
  setTimelineSelection,
  timelines,

  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  isStartMonthInvalid,
  isEndMonthInvalid,

  year,
  setYear,

  monthsList,
  multipleMonths,
  setMultipleMonths,

  quarterlyList,
  quarterlySelection,
  setQuarterlySelection,
}) => {
  return (
    <>
      {/* Timeline selection */}
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Selection</InputLabel>
        <Select
          value={timelineSelection}
          label="Selection"
          size="small"
          onChange={(e) => setTimelineSelection(e.target.value)}
        >
          {timelines.map((t) => (
            <MenuItem key={t.value} value={t.value}>
              {t.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* RANGE */}
        {timelineSelection === "range" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Start */}
            <Box sx={{ position: "relative" }}>
              <DatePicker
                views={["year", "month"]}
                label="Start Month"
                value={startMonth}
                maxDate={endMonth || undefined}
                disableFuture
                onChange={setStartMonth}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 200 },
                    InputProps: {
                      endAdornment: startMonth && (
                        <IconButton size="small" onClick={() => setStartMonth(null)}>
                          <X size={16} />
                        </IconButton>
                      ),
                    },
                  },
                }}
              />
              {isStartMonthInvalid && (
                <FormHelperText sx={{ position: "absolute", bottom: -20, color: "orange" }}>
                  <Info size={12} /> Start month is required
                </FormHelperText>
              )}
            </Box>

            {/* End */}
            <Box sx={{ position: "relative" }}>
              <DatePicker
                views={["year", "month"]}
                label="End Month"
                value={endMonth}
                minDate={startMonth || undefined}
                disableFuture
                onChange={setEndMonth}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: 200 },

                    InputProps: {
                      endAdornment: endMonth && (
                        <IconButton size="small" onClick={() => setEndMonth(null)}>
                          <X size={16} />
                        </IconButton>
                      ),
                    },
                  },
                }}
              />
              {isEndMonthInvalid && (
                <FormHelperText sx={{ position: "absolute", bottom: -36, color: "orange" }}>
                  <Info size={12} /> End month must be after start month
                </FormHelperText>
              )}
            </Box>
          </Box>
        )}

        {/* MONTHLY */}
        {timelineSelection === "monthly" && (
          <>
            <DatePicker
              views={["year"]}
              label="Select Year"
              value={year}
              onChange={(v) => {
                setYear(v);
                setMultipleMonths(v ? monthsList.map((m) => m.value) : []);
              }}
              disableFuture
              slotProps={{
                textField: {
                  size: "small",
                  sx: { width: 200 },
                  InputProps: {
                    endAdornment: year && (
                      <IconButton size="small" onClick={() => setYear(null)}>
                        <X size={16} />
                      </IconButton>
                    ),
                  },
                },
              }}
            />

            <FormControl sx={{ width: 200 }} size="small">
              <InputLabel>Select Months</InputLabel>
              <Select
                multiple
                value={multipleMonths}
                onChange={(e) =>
                  setMultipleMonths([...new Set(e.target.value)])
                }
                input={<OutlinedInput label="Select Months" />}
                disabled={!year}
                renderValue={(selected) =>
                  selected.length === 12 ? "All Months" : selected.join(", ")
                }
              >
                {monthsList.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    <Checkbox checked={multipleMonths.includes(m.value)} />
                    <ListItemText primary={m.label} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {/* QUARTERLY */}
        {timelineSelection === "quarterly" && (
  <>
    <DatePicker
      views={["year"]}
      label="Select Year"
      value={year}
      onChange={(v) => {
        setYear(v);
        setQuarterlySelection([]);
      }}
      disableFuture
      slotProps={{
        textField: { size: "small", sx: { width: 200 } },
      }}
    />

    <FormControl sx={{ width: 200 }} size="small">
      <InputLabel>Select Quarter</InputLabel>
      <Select
        multiple
        value={quarterlySelection}
        onChange={(e) =>
          setQuarterlySelection([...new Set(e.target.value)])
        }
        input={<OutlinedInput label="Select Quarter" />}
        disabled={!year}
        renderValue={(selected) =>
          selected.length === 0
            ? "Select Quarter"
            : selected
                .map(
                  (q) =>
                    quarterlyList.find((x) => x.value === q)?.label
                )
                .join(", ")
        }
      >
        {quarterlyList.map((q) => (
          <MenuItem key={q.value} value={q.value}>
            <Checkbox checked={quarterlySelection.includes(q.value)} />
            <ListItemText primary={q.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </>
)}

      </LocalizationProvider>
    </>
  );
};

export default TimeRangeSelector;
