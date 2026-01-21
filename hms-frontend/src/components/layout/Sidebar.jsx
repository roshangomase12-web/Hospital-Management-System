import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, Calendar, Users, UserCircle, LogOut, Stethoscope, UserPlus, ShieldCheck } from "lucide-react";

export default function Sidebar({ role }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
    ${isActive(path) ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
  `;

  // Standardize the role string (removes ROLE_ if present)
  const displayRole = role?.replace('ROLE_', '');

  return (
    <aside className="w-64 bg-slate-950 text-white p-6 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      {/* --- BRANDING PORTION --- */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Stethoscope size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">MedFlow</h1>
      </div>
      
      {/* --- USER ACCOUNT INFO PORTION --- */}
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account</p>
        <div className="flex items-center gap-3 p-2 bg-slate-900/50 rounded-2xl border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold uppercase">
            {user?.username?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-[10px] text-slate-500 uppercase">{displayRole}</p>
          </div>
        </div>
      </div>
      
      {/* --- DYNAMIC NAVIGATION MENU --- */}
      <nav className="flex flex-col gap-2 flex-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu</p>
        
        {/* --- ADMIN ONLY LINKS --- */}
        {(role === "ADMIN" || role === "ROLE_ADMIN") && (
          <>
            <Link className={linkClass("/admin")} to="/admin"><LayoutDashboard size={18} /> Dashboard</Link>
            <Link className={linkClass("/admin/appointments")} to="/admin/appointments"><Calendar size={18} /> Appointments</Link>
            <Link className={linkClass("/admin/doctors")} to="/admin/doctors"><Users size={18} /> Manage Doctors</Link>
            
            {/* LINK 1: Dedicated Patient list (No Admin IDs here!) */}
            <Link className={linkClass("/admin/patients")} to="/admin/patients"><Users size={18} /> Patient Directory</Link>
            
            {/* LINK 2: Staff management for Admin IDs */}
            <Link className={linkClass("/admin/staff")} to="/admin/staff">
  <ShieldCheck size={18} /> Admin Staff
</Link>
            <Link className={linkClass("/admin/create")} to="/admin/create"><UserPlus size={18} /> Add New Staff</Link>
          </>
        )}

        {/* --- DOCTOR ONLY LINKS --- */}
        {(role === "DOCTOR" || role === "ROLE_DOCTOR") && (
          <>
            <Link className={linkClass("/doctor")} to="/doctor"><LayoutDashboard size={18} /> Dashboard</Link>
            <Link className={linkClass("/doctor/appointments")} to="/doctor/appointments"><Calendar size={18} /> Appointments</Link>
            <Link className={linkClass("/doctor/profile")} to="/doctor/profile"><UserCircle size={18} /> My Profile</Link>
          </>
        )}

        {/* --- PATIENT ONLY LINKS --- */}
        {(role === "PATIENT" || role === "ROLE_PATIENT") && (
          <>
            <Link className={linkClass("/patient")} to="/patient"><Stethoscope size={18} /> Find Doctors</Link>
            <Link className={linkClass("/patient/appointments")} to="/patient/appointments"><Calendar size={18} /> My Bookings</Link>
          </>
        )}
      </nav>

      {/* --- LOGOUT SECTION --- */}
      <button 
        onClick={onLogout} 
        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-semibold"
      >
        <LogOut size={18} /> Logout
      </button>
    </aside>
  );
}