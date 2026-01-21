import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Calendar, Clock, CheckCircle, Stethoscope, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // 1. Import useAuth

export default function AdminDashboard() {
  const { darkMode } = useAuth(); // Add this line
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmins: 0, // Add this line
    totalAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


// src/pages/admin/AdminDashboard.jsx
useEffect(() => {
    const fetchStats = async () => {
        try {
            // Ensure port matches your Spring Boot log (8083)
            const response = await api.get('/admin/stats'); 
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
            // Optional: Set default stats so the UI doesn't break
            setStats({ 
                totalDoctors: 0, 
                totalPatients: 0, 
                
                totalAppointments: 0, 
                pendingAppointments: 0 
            });
        } finally {
            // ✅ This runs whether the try SUCCEEDS or FAILS
            setLoading(false); 
        }
    };
    fetchStats();
}, []);

 // 1. Update the StatCard to accept an 'onClick' prop
const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-200 active:scale-95' : ''}`}
  >
    <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-4`}>
      <Icon size={24} className="text-white" />
    </div>
    <p className="text-slate-500 font-medium text-sm">{label}</p>
    <h3 className="text-3xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

  if (loading) return <div className="p-10 animate-pulse text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Hospital Overview</h2>
        <p className="text-slate-500">Real-time status of your medical facility.</p>
      </div>

      {/* Stats Grid */}
    {/* Updated Stats Grid with onClick actions */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
  <StatCard 
    icon={Users} 
    label="Admins" 
    value={stats.totalAdmins} 
    color="bg-purple-600" 
    onClick={() => navigate("/admin/staff")} 
  />
  <StatCard 
    icon={Stethoscope} 
    label="Total Doctors" 
    value={stats.totalDoctors} 
    color="bg-blue-600" 
    onClick={() => navigate("/admin/doctors")} 
  />
  <StatCard 
    icon={Users} 
    label="Total Patients" 
    value={stats.totalPatients} 
    color="bg-indigo-600" 
    onClick={() => navigate("/admin/patients")} 
  />
  <StatCard 
    icon={Calendar} 
    label="Appointments" 
    value={stats.totalAppointments} 
    color="bg-emerald-600" 
    onClick={() => navigate("/admin/appointments")} 
  />
  <StatCard 
    icon={Clock} 
    label="Pending Requests" 
    value={stats.pendingAppointments} 
    color="bg-amber-500" 
    onClick={() => navigate("/admin/appointments")} 
  />
  
</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Management</h3>
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/admin/doctors")}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-blue-600"><Stethoscope size={20} /></div>
                <span className="font-semibold text-slate-700">Manage Medical Staff</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => navigate("/admin/patients")}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:text-indigo-600"><Users size={20} /></div>
                <span className="font-semibold text-slate-700">Patient Directory</span>
              </div>
              <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Appointment Summary Card */}
        <div className="bg-blue-600 p-8 rounded-3xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Appointment Tracking</h3>
            <p className="text-blue-100 mb-6 text-sm">You have {stats.pendingAppointments} requests waiting for approval.</p>
            <button 
              onClick={() => navigate("/admin/appointments")}
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all"
            >
              View All Appointments
            </button>
          </div>
          <Calendar size={150} className="absolute -right-10 -bottom-10 text-blue-500 opacity-20" />
        </div>
      </div>
    </div>
  );
}