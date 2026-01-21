import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Stethoscope, 
  Users, 
  LogOut, 
  UserPlus,
  Clock
} from "lucide-react";

export default function Sidebar({ role, handleLogout }) {
  const location = useLocation();

  // Define links based on user roles
  const menuConfig = {
    ADMIN: [
      { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
      { name: "Manage Doctors", path: "/admin/doctors", icon: <Stethoscope size={20} /> },
      { name: "Manage Patients", path: "/admin/patients", icon: <Users size={20} /> },
      { name: "Appointments", path: "/admin/appointments", icon: <Calendar size={20} /> },
      { name: "Add Staff", path: "/admin/create", icon: <UserPlus size={20} /> },
    ],
    DOCTOR: [
      { name: "Dashboard", path: "/doctor", icon: <LayoutDashboard size={20} /> },
      { name: "My Schedule", path: "/doctor/appointments", icon: <Clock size={20} /> },
    ],
    PATIENT: [
      { name: "Find Doctors", path: "/patient", icon: <Stethoscope size={20} /> },
      { name: "My Bookings", path: "/patient/appointments", icon: <Calendar size={20} /> },
    ],
  };

  const links = menuConfig[role] || [];

  return (
    <aside className="w-64 bg-white border-r flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Stethoscope /> HMS Core
        </h1>
        <p className="text-xs text-slate-400 mt-1">{role} Portal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? "bg-blue-50 text-blue-600 font-medium" 
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}