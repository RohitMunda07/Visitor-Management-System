import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Role check
  if (allowedRole) {
    // allowedRole can be string or array
    const allowedRoles = Array.isArray(allowedRole)
      ? allowedRole
      : [allowedRole];

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  // Authorized
  return children;
}
