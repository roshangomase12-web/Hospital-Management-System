import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Pages
import Login from "./pages/auth/Login";

// Patient Pages
import FindDoctors from "./pages/patient/FindDoctors";
import BookingPage from './pages/patient/BookingPage'; 
import PatientMyAppointments from "./pages/patient/PatientMyAppointments";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminDoctors from "./pages/admin/AdminDoctors"; 
import AdminCreateUser from "./pages/admin/AdminCreateUser";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";

/**
 * Handles automatic redirection based on user role 
 * when accessing the generic /dashboard path.
 */
function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  const rolePaths = {
    ROLE_ADMIN: "/admin",
    ROLE_DOCTOR: "/doctor",
    ROLE_PATIENT: "/patient"
  };
  
  return <Navigate to={rolePaths[user.role] || "/login"} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Universal Dashboard Redirect */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <RoleRedirect />
          </ProtectedRoute>
        } />

        {/* =========================
            ADMIN ROUTES
        ========================= */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}>
          <Route element={<DashboardLayout role="ADMIN" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/doctors" element={<AdminDoctors />} />
            <Route path="/admin/create" element={<AdminCreateUser />} />
            {/* Admin viewing a specific doctor's schedule */}
            <Route path="/admin/doctors/:id" element={<DoctorAppointments />} />
          </Route>
        </Route>

        {/* =========================
            DOCTOR ROUTES
        ========================= */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_DOCTOR"]} />}>
          <Route element={<DashboardLayout role="DOCTOR" />}>
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
          </Route>
        </Route>

        {/* =========================
            PATIENT ROUTES
        ========================= */}
        <Route element={<ProtectedRoute allowedRoles={["ROLE_PATIENT"]} />}>
          <Route element={<DashboardLayout role="PATIENT" />}>
            {/* Main view for patient to find doctors */}
            <Route path="/patient" element={<FindDoctors />} /> 
            <Route path="/patient/appointments" element={<PatientMyAppointments />} />
            {/* Patient selecting slots for a specific doctor */}
            <Route path="/patient/book/:doctorId" element={<BookingPage />} />
          </Route>
        </Route>

        {/* Catch-all: Redirect unknown routes to home/login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}