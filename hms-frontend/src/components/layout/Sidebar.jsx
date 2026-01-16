import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside style={sidebarStyle}>
      <h3 style={{ color: "#3b82f6", fontSize: "24px", marginBottom: "10px" }}>HMS</h3>
      <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "20px" }}>Logged in as: {role}</p>
      
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {role === "ADMIN" && (
          <>
            <Link style={linkStyle} to="/admin">Dashboard</Link>
            <Link style={linkStyle} to="/admin/appointments">Appointments</Link>
            <Link style={linkStyle} to="/admin/doctors">Manage Doctors</Link>
          </>
        )}
        {role === "DOCTOR" && (
          <>
            <Link style={linkStyle} to="/doctor">Dashboard</Link>
            <Link style={linkStyle} to="/doctor/appointments">Appointments</Link>
          </>
        )}
        {role === "PATIENT" && (
          <>
            {/* ✅ FIXED: Link to /patient for Find Doctors */}
            <Link style={linkStyle} to="/patient">Find Doctors</Link>
            {/* ✅ FIXED: Link to /patient/appointments for My Bookings */}
            <Link style={linkStyle} to="/patient/appointments">My Bookings</Link>
          </>
        )}
      </nav>

      <button onClick={onLogout} style={logoutStyle}>Logout</button>
    </aside>
  );
}

const sidebarStyle = { width: "240px", background: "#111827", color: "#fff", padding: "20px", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 };
const linkStyle = { color: "#d1d5db", textDecoration: "none", padding: "10px", borderRadius: "8px", transition: "background 0.2s" };
const logoutStyle = { marginTop: "auto", padding: "12px", background: "#dc2626", color: "#fff", border: "none", cursor: "pointer", borderRadius: "8px", fontWeight: "bold" };