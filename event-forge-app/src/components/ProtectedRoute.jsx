import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(UserContext);
  const location = useLocation();

  // Not logged in → send to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Role-based access (if specified)
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "ORGANIZER") {
        return <Navigate to="/organizer-dashboard" replace />;
      }
      if (user.role === "GUEST") {
        return <Navigate to="/guest-dashboard" replace />;
      }
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}
