// This is the main generic Report component. It orchestrates URL-driven
// pagination and filtering, fetching data, and displaying it.
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, IconButton, useTheme } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterComponent from "./FilterComponent";
import DynamicTable from "./DynamicTable";
import Loader from "./Loader";
import Snackbar from "./Snackbar";

// Report component now accepts `allowedFilterKeys` directly for filter definition
const Report = ({ getReport, dataKey, allowedFilterKeys }) => {
  // Removed filterConfig from props
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useTheme();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Memoize these functions to prevent unnecessary re-renders of useEffect
  // and to ensure stable function references for dependencies.
  const closeSnackbar = useCallback(() => setSnackbarOpen(false), []);
  const showSnackbar = useCallback((message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []); // Dependencies: None, as setters are stable

  const [showLoader, setShowLoader] = useState(true);
  const [pageNumber, setPageNumber] = useState(0); // 0-indexed for MUI TablePagination
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [columnTitles, setColumnTitles] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  // appliedFilter stores filters in the format [{key: [value1, value2]}, ...]
  const [appliedFilter, setAppliedFilter] = useState([]);
  // Set filterOpen to true by default for demonstration purposes.
  // In a real application, this should be useState(false).
  const [filterOpen, setFilterOpen] = useState(false); // Changed to true for debugging UI visibility
  // initialized ensures effects run only after initial URL parsing is complete
  const [initialized, setInitialized] = useState(false);

  // --- Parse URL Parameters ---
  // Memoized function to extract pagination and filter data from the URL query string.
  // This ensures the component state is synchronized with the URL on load.
  const parseUrlParams = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const page = Math.max(1, parseInt(params.get("page") || "1", 10));
    const limit = Math.min(
      Math.max(1, parseInt(params.get("limit") || "20", 10)),
      50
    ); // customize the rows per page limit (limit) as per requirement or table limits

    const filters = {};
    for (const [key, value] of params.entries()) {
      // Handle array parameters like `key[]` by stripping `[]`
      const cleanKey = key.endsWith("[]") ? key.slice(0, -2) : key;
      // Only include keys that are explicitly allowed to prevent unexpected filters
      // `allowedFilterKeys` is used here to validate URL parameters against known filter keys.
      if (
        allowedFilterKeys.includes(cleanKey) &&
        !["page", "limit"].includes(cleanKey) // Exclude pagination params from general filters
      ) {
        // Accumulate multiple values for the same key (e.g., studentClass[]=5&studentClass[]=6)
        filters[cleanKey] = filters[cleanKey]
          ? [...filters[cleanKey], value]
          : [value];
      }
    }

    // Convert the filters object into the array of objects format expected by appliedFilter state
    // e.g., {studentClass: ['5']} -> [{studentClass: ['5']}]
    const filterArray = Object.entries(filters).map(([key, values]) => ({
      [key]: values,
    }));

    return { page: page - 1, limit, filters: filterArray }; // Return 0-indexed page
  }, []);

  // --- Initialize State from URL on First Load ---
  // This effect runs only once on component mount to set the initial state
  // based on the URL query parameters. It also ensures the URL is clean
  // if it contained invalid or default parameters.
  useEffect(() => {
    if (!initialized) {
      const { page, limit, filters } = parseUrlParams();
      setPageNumber(page);
      setItemsPerPage(limit);
      setAppliedFilter(filters);

      // Reconstruct URL params to ensure consistency (e.g., remove invalid ones)
      const params = new URLSearchParams();
      params.set("page", (page + 1).toString()); // Convert back to 1-indexed for URL
      params.set("limit", limit.toString());
      filters.forEach((filter) =>
        Object.entries(filter).forEach(([key, values]) =>
          values.forEach((v) => params.append(`${key}[]`, v))
        )
      );

      const newQuery = params.toString();
      // Only navigate if the URL needs to be updated (e.g., cleaned up)
      if (newQuery !== location.search.slice(1)) {
        navigate(`${location.pathname}?${newQuery}`, { replace: true }); // Use replace to avoid extra history entries
      }

      setInitialized(true);
      console.log("Report component initialized state set to true.");
    }
  }, []);

  // --- Update URL on State Changes (Pagination, Filters) ---
  // This effect synchronizes the component's internal state (page, limit, filters)
  // with the URL query parameters whenever these states change.
  useEffect(() => {
    if (!initialized) return; // Only update URL after initial state is set

    const params = new URLSearchParams();
    params.set("page", (pageNumber + 1).toString()); // Convert to 1-indexed for URL
    params.set("limit", itemsPerPage.toString());

    // Consolidate applied filters from array of objects to a single object for easier processing
    // and then append them to URLSearchParams. Using Set to handle potential duplicates.
    const filterValues = {};
    appliedFilter.forEach((filter) => {
      Object.entries(filter).forEach(([key, values]) => {
        if (!filterValues[key]) {
          filterValues[key] = new Set(values);
        } else {
          values.forEach((v) => filterValues[key].add(v));
        }
      });
    });

    Object.entries(filterValues).forEach(([key, values]) => {
      Array.from(values).forEach((v) => {
        params.append(`${key}[]`, v);
      });
    });

    const newQuery = params.toString();
    const currentQuery = location.search.slice(1);

    // Only navigate if the query string has actually changed to avoid unnecessary history entries
    if (newQuery !== currentQuery) {
      navigate(`${location.pathname}?${newQuery}`, { replace: false }); // Use replace: false for normal history navigation
    }
  }, [pageNumber, itemsPerPage, appliedFilter, initialized]); // Dependencies: re-run when pagination or filters change

  // --- Data Fetching Effect ---
  // This effect triggers the API call whenever pagination or filter state changes.
  useEffect(() => {
    if (!initialized) {
      console.log("Data fetch skipped: Report not yet initialized.");
      return;
    }

    // Transform appliedFilter (array of objects) into a single object for the API call
    // e.g., [{studentClass: ['5']}, {gender: ['Male']}] -> {studentClass: ['5'], gender: ['Male']}
    const filterData = appliedFilter.reduce((acc, filterObj) => {
      return { ...acc, ...filterObj };
    }, {});

    // Construct API parameters, converting page back to 1-indexed for the API
    const apiParams = {
      page: pageNumber + 1,
      limit: itemsPerPage,
      ...filterData,
    };

    const fetchData = async () => {
      try {
        setShowLoader(true);
        // console.log("api is calling......... (Loader set to true)"); // Debug log
        const data = await getReport(apiParams); // Call the API function passed as prop
        // console.log("Data received from API:", data); // Debug log
        if (data && typeof data === "object") {
          const totalPages = Math.ceil(data.total / itemsPerPage);
          if (pageNumber >= totalPages && totalPages > 0) {
            // Check if current page is beyond total pages (0-indexed) AND there's actually data
            setPageNumber(0); // Reset to first page
            return;
          } else if (totalPages === 0 && pageNumber !== 0) {
            // If filters result in no data, ensure page is 0
            setPageNumber(0);
            return;
          }

          setColumnTitles(data.dataMapping || []);
          setRowsData(data[dataKey] || []); // Use dataKey prop to access the correct data array
          setTotalItems(data.total || 0);
          // Provide user feedback if data is empty or partial
          if (data[dataKey]?.length === 0 && data.total > 0) {
            showSnackbar(
              "No data for current page. Adjust filters or page.",
              "warning"
            );
          } else if (data.total === 0) {
            showSnackbar("No data found matching current filters.", "info");
          }
        } else {
          // Handle cases where API response structure is unexpected
          setColumnTitles([]);
          setRowsData([]);
          setTotalItems(0);
          showSnackbar("No valid data returned from API.", "warning");
        }
      } catch (error) {
        // Centralized error handling for API calls
        console.error(`Error fetching report:`, error);
        showSnackbar(`Failed to fetch data: ${error.message}`, "error");
        setColumnTitles([]);
        setRowsData([]);
        setTotalItems(0);
      } finally {
        setShowLoader(false);
        // console.log("Loader set to false (fetchData completed)."); // Debug log
      }
    };

    fetchData();
  }, [pageNumber, itemsPerPage, appliedFilter, initialized]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        minHeight: "100vh",
        width: "100vw",
        bgcolor: "background.default",
        // border: "1px solid red", // Debugging border - remove in production
      }}
    >
      {/* Filter Button: Appears fixed on screen when filter drawer is closed and data is loaded */}
      {!filterOpen && !showLoader && (
        <Box sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1300 }}>
          <IconButton
            color="primary"
            sx={{
              width: 56,
              height: 56,
              bgcolor: "primary.main",
              boxShadow: 3,
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
            onClick={() => setFilterOpen(true)}
            aria-label="Open Filters"
          >
            <FilterAltIcon sx={{ color: "white" }} />
          </IconButton>
        </Box>
      )}

      {/* Filter Component: Rendered as a Drawer when filterOpen is true */}
      {filterOpen && (
        <FilterComponent
          appliedFilter={appliedFilter}
          setAppliedFilter={setAppliedFilter}
          setFilterOpen={setFilterOpen}
          allowedFilterKeys={allowedFilterKeys} // Pass allowedFilterKeys here
        />
      )}

      {/* Loader or Table: Conditionally render based on loading state */}
      {showLoader && <Loader />}
      {!showLoader && (
        <Box
          sx={{
            flexGrow: 1,
            minHeight: 0, // Allows content to shrink if needed
            p: { xs: 0, md: 2 },
            pt: { xs: 0, md: 3 },
          }}
        >
          <DynamicTable
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            columnTitles={columnTitles}
            rowsData={rowsData}
            totalItems={totalItems}
          />
        </Box>
      )}

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </Box>
  );
};

export default Report;
