import { Box, MenuItem, Select, TextField, Typography } from "@mui/material";

const DynamicSearchSelector = ({
  options,           // [{ value, label }]
  selectedOption,
  setSelectedOption,
  searchQuery,
  setSearchQuery,
  error,
  setError,
  pattern,
}) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <Select
        size="small"
        sx={{ width: 160 }}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>

      <Box sx={{ position: "relative", width: 200 }}>
        <TextField
          size="small"
          fullWidth
          placeholder={`Search by ${selectedOption}`}
          value={searchQuery}
          onChange={(e) => {
            const value = e.target.value;
            setSearchQuery(value);

            if (!value) return setError("");
            if (!pattern.test(value)) {
              setError(
                "First 2 characters must be letters, then letters/numbers/- allowed"
              );
            } else {
              setError("");
            }
          }}
          error={Boolean(error)}
        />

        {error && (
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              color: "red",
              fontSize: "11px",
              mt: "2px",
            }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DynamicSearchSelector;
