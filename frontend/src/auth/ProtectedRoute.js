import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowed }) {
  const role = localStorage.getItem("role");

  if (!role) return <Navigate to="/login" />;

  return allowed.includes(role) ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
