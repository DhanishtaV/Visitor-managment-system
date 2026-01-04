import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowed }) {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if (!token || !role) {
    return <Navigate to="/login" />;
  }

  if (!allowed.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
