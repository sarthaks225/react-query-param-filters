// This component provides a simple MUI Snackbar.
import { Snackbar as MuiSnackbar, Alert } from "@mui/material";

const Snackbar = ({ open, message, severity, onClose }) => {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
};

export default Snackbar;
