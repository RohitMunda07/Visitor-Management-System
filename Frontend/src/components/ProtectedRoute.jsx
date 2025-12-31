import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role-based check (supports multiple roles)
  if (allowedRole && Array.isArray(allowedRole)) {
    if (!allowedRole.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  // Single-role fallback (optional safety)
  if (allowedRole && typeof allowedRole === "string") {
    if (allowedRole !== role) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}
