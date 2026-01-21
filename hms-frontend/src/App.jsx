import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// AUTH PAGES
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminDoctors from "./pages/admin/AdminDoctors"; 
import AdminCreateUser from "./pages/admin/AdminCreateUser";
import AdminPatients from "./pages/admin/AdminPatients";
import AdminUserManagement from "./pages/admin/AdminUserManagement";

// DOCTOR PAGES
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";

// PATIENT PAGES
import FindDoctors from "./pages/patient/FindDoctors";
import BookingPage from './pages/patient/BookingPage'; 
import PatientMyAppointments from "./pages/patient/PatientMyAppointments";

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  const rolePaths = { ROLE_ADMIN: "/admin", ROLE_DOCTOR: "/doctor", ROLE_PATIENT: "/patient" };
  return <Navigate to={rolePaths[user.role] || "/login"} />;
}

export default function App() {
  const { darkMode } = useAuth(); // ✅ LISTEN TO GLOBAL THEME

  return (
    <BrowserRouter>
      {/* ✅ GLOBAL WRAPPER: This makes every page dark or light */}
      <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-900"}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

          {/* ADMIN ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
            <Route element={<DashboardLayout role="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/doctors" element={<AdminDoctors />} />
              <Route path="/admin/create" element={<AdminCreateUser />} />
              <Route path="/admin/patients" element={<AdminPatients />} />
              <Route path="/admin/staff" element={<AdminUserManagement />} />
            </Route>
          </Route>

          {/* DOCTOR ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR"]} />}>
            <Route element={<DashboardLayout role="DOCTOR" />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/profile" element={<DoctorProfile />} />
            </Route>
          </Route>

          {/* PATIENT ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
            <Route element={<DashboardLayout role="PATIENT" />}>
              <Route path="/patient" element={<FindDoctors />} /> 
              <Route path="/patient/appointments" element={<PatientMyAppointments />} />
              <Route path="/patient/book/:doctorId" element={<BookingPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}