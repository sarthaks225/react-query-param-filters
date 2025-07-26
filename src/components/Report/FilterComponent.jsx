// This component handles the filter UI using MUI Drawer and manages
// temporary filter selections before applying them to the main report.
import { useState, useCallback } from "react"; // Import useCallback
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Drawer,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt"; // Corrected import for FilterAltIcon
import { getMockFilterOptions } from "../../data/mockApi";

const FilterComponent = ({
  appliedFilter, // Current filters from the Report component (from URL)
  setAppliedFilter, // Function to update filters in the Report component
  setFilterOpen, // Function to close the filter drawer
  allowedFilterKeys, // Prop: defines the actual filter keys expected in URL and by API
}) => {
  const theme = useTheme();

  // Helper function to get user-friendly name from filter key
  const getFilterName = (filterKey) => {
    switch (filterKey) {
      case "studentClass":
        return "class";
      case "gender":
        return "gender";
      case "house":
        return "house";
      default:
        return filterKey; // Fallback for direct mapping
    }
  };

  // tempFilters holds the selections made within this drawer,
  // allowing changes without immediately affecting the main report.
  // Initialized by validating `appliedFilter` against available options.
  const [tempFilters, setTempFilters] = useState(() => {
    const initialTemp = {};
    // Create a map from filterKey to its valid options.
    // This is crucial for validating incoming URL parameters and for rendering options.
    const filterKeyToValidOptionsMap = new Map();
    (allowedFilterKeys || []).forEach((key) => {
      // Use getFilterName to get the user-friendly name for getMockFilterOptions
      filterKeyToValidOptionsMap.set(
        key,
        new Set(getMockFilterOptions(getFilterName(key)))
      );
    });

    appliedFilter.forEach((filterObj) => {
      Object.entries(filterObj).forEach(([key, values]) => {
        const validOptions = filterKeyToValidOptionsMap.get(key);
        if (validOptions) {
          // Check if the key is defined in our allowedFilterKeys
          // Filter out any values from the URL that are not valid options for this filter
          initialTemp[key] = (values || []).filter((value) =>
            validOptions.has(value)
          );
        }
      });
    });
    return initialTemp;
  });

  // Handles changes in individual filter dropdowns (multi-select).
  // `event.target.value` for MUI Select (multiple) is already an array of selected items.
  const handleFilterChange = useCallback((filterKey, event) => {
    const newSelectedValues = event.target.value;
    setTempFilters((prev) => ({
      ...prev,
      [filterKey]: newSelectedValues,
    }));
  }, []); // Dependencies: None, as it uses functional update for setTempFilters

  // Applies the temporary filters to the parent component's state,
  // which triggers URL update and data fetching in the Report component.
  const applyFilters = useCallback(() => {
    // Convert tempFilters (object: {key: [values]}) back to the
    // `appliedFilter` format (array of objects: [{key: [values]}])
    const newAppliedFilter = Object.entries(tempFilters)
      .filter(([, values]) => values && values.length > 0) // Only include filters with selected values
      .map(([key, values]) => ({ [key]: values }));
    setAppliedFilter(newAppliedFilter);
    setFilterOpen(false); // Close the drawer
  }, [tempFilters, setAppliedFilter, setFilterOpen]); // Dependencies: tempFilters and setter functions

  // Resets all filters in the drawer and in the parent component.
  const resetFilters = useCallback(() => {
    const resetTemp = {};
    // Initialize all temporary filters to empty arrays based on allowedFilterKeys
    (allowedFilterKeys || []).forEach((key) => {
      // Safely iterate over allowedFilterKeys
      resetTemp[key] = [];
    });
    setTempFilters(resetTemp);
    setAppliedFilter([]); // Clear filters in the parent component
    setFilterOpen(false); // Close the drawer
  }, [allowedFilterKeys, setAppliedFilter, setFilterOpen]); // Dependencies: allowedFilterKeys and setter functions

  // Handles closing the drawer without applying changes.
  // Reverts tempFilters to the state of appliedFilter (from URL),
  // ensuring only valid options are retained.
  const handleClose = useCallback(() => {
    const initialTemp = {};
    // Re-create the filterKeyToValidOptionsMap for reverting logic
    const filterKeyToValidOptionsMap = new Map();
    (allowedFilterKeys || []).forEach((key) => {
      // Safely iterate over allowedFilterKeys
      filterKeyToValidOptionsMap.set(
        key,
        new Set(getMockFilterOptions(getFilterName(key)))
      );
    });

    appliedFilter.forEach((filterObj) => {
      Object.entries(filterObj).forEach(([key, values]) => {
        const validOptions = filterKeyToValidOptionsMap.get(key);
        if (validOptions) {
          initialTemp[key] = (values || []).filter((value) =>
            validOptions.has(value)
          );
        }
      });
    });
    setTempFilters(initialTemp); // Revert temporary state
    setFilterOpen(false); // Close the drawer
  }, [appliedFilter, setFilterOpen, allowedFilterKeys]); // Dependencies: appliedFilter, setFilterOpen, allowedFilterKeys

  return (
    <Drawer
      anchor="right"
      open={true} // Drawer is always open when FilterComponent is rendered
      onClose={handleClose} // Callback when the drawer is closed (e.g., by clicking outside)
      sx={{
        zIndex: theme.zIndex.drawer + 1, // Ensure it's above other content
        "& .MuiDrawer-paper": {
          width: { xs: "100vw", sm: 430 }, // Full width on small screens, fixed on larger
          boxSizing: "border-box", // Include padding and border in the element's total width and height
          p: 2, // Padding inside the drawer
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", // Enable scrolling for content if it overflows vertically
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2, // Margin bottom for separation from divider
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Filters
        </Typography>
        <IconButton onClick={handleClose} aria-label="Close filters">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

      {/* Filter options container: Allows its content to scroll independently */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", pb: 2, pt: 2 }}>
        <Grid container spacing={2}>
          {(allowedFilterKeys || []).map((filterKey) => {
            // Iterate over allowedFilterKeys directly
            const filterName = getFilterName(filterKey); // Get user-friendly name for label
            const options = getMockFilterOptions(filterName); // Get options using the user-friendly name
            const selectedValues = tempFilters[filterKey] || [];

            return (
              <Grid item xs={12} key={filterKey} sx={{ width: "100%" }}>
                {" "}
                {/* Use filterKey for unique key */}
                <FormControl fullWidth variant="outlined">
                  <InputLabel>{filterName}</InputLabel>
                  <Select
                    multiple // Enables multi-selection
                    value={selectedValues} // Controlled component: value is an array
                    onChange={(e) => handleFilterChange(filterKey, e)} // Pass key and event
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    label={filterName}
                  >
                    {options.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Action buttons: Pushed to the bottom of the drawer */}
      <Box
        sx={{
          mt: "auto", // Pushes buttons to the bottom, taking remaining space
          pt: 2, // Padding top for separation from filter options
          borderTop: `1px solid ${theme.palette.divider}`, // Separator line
          display: "flex",
          flexDirection: "column",
          gap: 1, // Space between buttons
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={applyFilters}
          // disabled={isLoading} // Re-add if you implement isLoading state
        >
          Apply Filters
          <FilterAltIcon sx={{ ml: 1 }} />
        </Button>
        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={resetFilters}
          // disabled={isLoading} // Re-add if you implement isLoading state
        >
          Reset Filters
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterComponent;
