import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export default function DashboardLayout({ role }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar - Fixed on the left */}
      <Sidebar role={role} handleLogout={handleLogout} />

      {/* Main Content - Scrollable on the right */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}