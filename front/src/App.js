import React from "react";
import { Route, Routes } from "react-router-dom";
import Authentication from "./Pages/Login";
import CustomerDashboard from "./Pages/CustomerDashboard";
import SurveyorDashboard from "./Pages/SurveyorDashboard";
import GovernmentDashboard from "./Pages/GovernmentDashboard";
import Register from "./Pages/Register";
import { createTheme, ThemeProvider } from "@mui/material";


function App() {
  const theme = createTheme({
    typography: {
      fontFamily: "Quicksand, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Authentication />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/surveyor-dashboard" element={<SurveyorDashboard />} />
        <Route path="/government-dashboard" element={<GovernmentDashboard />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
