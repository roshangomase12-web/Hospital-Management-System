import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Check, X, Loader2, ChevronLeft, Calendar, Clock, AlertCircle } from "lucide-react";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { id } = useParams(); // Doctor ID from URL (used by Admin)
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Unified Fetch Logic
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ Logic: If Admin and ID exists, fetch that specific doctor's data. 
      // Otherwise, fetch the logged-in doctor's own data.
      const endpoint = (user?.role === "ROLE_ADMIN" && id)
        ? `/admin/doctors/${id}/availability` 
        : "/doctor/appointments";

      const res = await api.get(endpoint);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response?.status === 403) {
        setError("Access Denied: You do not have permission to view this page.");
      } else {
        setError("Failed to load schedule. Please check backend connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // 2. Status Update (For Doctors only)
  const updateStatus = async (appId, action) => {
    try {
      await api.put(`/doctor/appointments/${appId}/${action}`);
      alert(`Appointment ${action}ed successfully!`);
      fetchAppointments(); 
    } catch (err) {
      alert("Action failed: " + (err.response?.data?.message || "Error"));
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error) return (
    <div className="p-10 text-center">
      <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 inline-block">
        <AlertCircle className="mx-auto mb-2" size={32} />
        <p className="font-bold">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-red-100 px-4 py-2 rounded-lg">Go Back</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Back Button for Admin */}
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 mb-4 hover:underline">
        <ChevronLeft size={20} /> Back
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          {user?.role === "ROLE_ADMIN" ? "Doctor Availability Schedule" : "My Patient Requests"}
        </h2>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold">
          Total Items: {appointments.length}
        </span>
      </div>
      
      <div className="grid gap-4">
        {appointments.length > 0 ? appointments.map(app => (
          <div key={app.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-500" />
                <span className="font-bold text-slate-800">
                  {app.availableDate || app.appointmentDate}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Clock size={16} />
                <span>{app.availableTime || app.appointmentTime} {app.endTime ? `- ${app.endTime}` : ""}</span>
              </div>

              {app.patientName && (
                <p className="text-sm font-medium text-slate-600">Patient: {app.patientName}</p>
              )}

              <p className={`text-xs font-bold uppercase tracking-wider mt-2 ${
                app.status === 'OPEN' || app.status === 'APPROVED' ? 'text-green-600' : 'text-orange-500'
              }`}>
                Status: {app.status}
              </p>
            </div>

            {/* Actions for Doctors */}
            {app.status === 'PENDING' && user?.role === "ROLE_DOCTOR" && (
              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(app.id, 'approve')} 
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-all"
                  title="Approve"
                >
                  <Check size={20}/>
                </button>
                <button 
                  onClick={() => updateStatus(app.id, 'reject')} 
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                  title="Reject"
                >
                  <X size={20}/>
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="bg-white p-16 text-center rounded-xl border-2 border-dashed text-slate-400">
            No records found.
          </div>
        )}
      </div>
    </div>
  );
}