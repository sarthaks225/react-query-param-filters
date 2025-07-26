import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "./theme/muiTheme";
import SchoolDataPage from "./pages/SchoolDataPage";

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<SchoolDataPage />} />
          <Route path="/school-data" element={<SchoolDataPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
