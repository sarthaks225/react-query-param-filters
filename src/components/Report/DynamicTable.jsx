// This component displays the fetched data in a simple MUI table.
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

const DynamicTable = ({
  pageNumber, // Current page number (0-indexed)
  setPageNumber, // Function to update the page number
  itemsPerPage, // Number of items to display per page
  setItemsPerPage, // Function to update items per page
  columnTitles, // Array of objects defining table columns: [{ key: 'id', title: 'ID' }]
  rowsData, // Array of objects representing table rows
  totalItems, // Total number of items available (for pagination count)
}) => {
  // Handles page change event from MUI TablePagination
  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
  };

  // Handles rows per page change event from MUI TablePagination
  const handleChangeRowsPerPage = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setPageNumber(0); // Reset to the first page when items per page changes
  };

  return (
    <Paper elevation={3} sx={{ width: "100%", overflow: "hidden" }}>
      <Typography variant="h5" component="h3" sx={{ p: 3 }}>
        Report Data
      </Typography>

      <>
        {rowsData.length > 0 ? (
          <TableContainer>
            <Table stickyHeader aria-label="dynamic table">
              <TableHead>
                <TableRow>
                  {columnTitles.map((col) => (
                    <TableCell key={col.key} sx={{ fontWeight: "bold" }}>
                      {col.title}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsData.map((row) => (
                  <TableRow hover key={row.id}>
                    {columnTitles.map((col) => (
                      <TableCell key={`${row.id}-${col.key}`}>
                        {row[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              No data available for the selected filters.
            </Typography>
          </Box>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={itemsPerPage}
          page={pageNumber}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ justifyItems: "center" }}
        />
      </>
    </Paper>
  );
};

export default DynamicTable;
