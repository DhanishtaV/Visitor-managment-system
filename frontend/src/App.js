import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VisitorForm from "./pages/VisitorForm";
import VisitorPass from "./pages/VisitorPass";

import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";               // Admin Dashboard
import SecurityDashboard from "./pages/SecurityDashboard";
import VisitorProtocol from "./pages/VisitorProtocol";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<VisitorForm />} />
        <Route path="/checkin" element={<VisitorForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pass/:id" element={<VisitorPass />} />
        <Route path="/visitor-protocol" element={<VisitorProtocol />} />


        {/* ================= ADMIN ROUTE ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SECURITY ROUTE ================= */}
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
