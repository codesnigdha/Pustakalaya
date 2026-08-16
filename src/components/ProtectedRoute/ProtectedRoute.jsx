import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  const location = useLocation();

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return <div className="route-loading">Loading...</div>;
  }

  /* =====================================================
     NOT LOGGED IN
  ===================================================== */

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* =====================================================
     ROLE PROTECTION
  ===================================================== */

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  /* =====================================================
     AUTHORIZED
  ===================================================== */

  return children || <Outlet />;
}

export default ProtectedRoute;
