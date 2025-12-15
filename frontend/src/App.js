import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";   // FIXED HERE
import VisitorForm from "./pages/VisitorForm";
import VisitorPass from "./pages/VisitorPass";
import ProtectedRoute from "./auth/ProtectedRoute";
import SecurityDashboard from "./pages/SecurityDashboard";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VisitorForm />} />
        <Route path="/checkin" element={<VisitorForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />  {/* FIXED */}
        <Route path="/pass/:id" element={<VisitorPass />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/security-dashboard" element={<SecurityDashboard />} />
        <Route
  path="/admin"
  element={
    <ProtectedRoute allowed={["admin"]}>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/security"
  element={
    <ProtectedRoute allowed={["security"]}>
      <SecurityDashboard />
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
