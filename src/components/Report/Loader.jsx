import { Box, CircularProgress, Typography } from "@mui/material";

const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="200px"
  >
    <CircularProgress size={60} thickness={4} />
    <Typography variant="h6" color="textSecondary" ml={2}>
      Loading data...
    </Typography>
  </Box>
);

export default Loader;
