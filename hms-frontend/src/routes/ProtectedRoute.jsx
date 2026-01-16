import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  // 1. Wait for AuthContext to check if a token exists in localStorage
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // 2. If not logged in, send to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If logged in but role doesn't match, send back to their home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const rolePaths = {
      ROLE_ADMIN: "/admin",
      ROLE_DOCTOR: "/doctor",
      ROLE_PATIENT: "/patient"
    };
    return <Navigate to={rolePaths[user.role]} replace />;
  }

  // 4. Everything is fine, render the sub-pages
  return <Outlet />;
}