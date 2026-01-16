import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* 1. Use the Sidebar component */}
      <Sidebar role={role} handleLogout={handleLogout} />

      {/* 2. Main content area */}
      <main style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        {/* This is where AdminDashboard, DoctorDashboard, etc. will render */}
        <Outlet /> 
      </main>
    </div>
  );
}