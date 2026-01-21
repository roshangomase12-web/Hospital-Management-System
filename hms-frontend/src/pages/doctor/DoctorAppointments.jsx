import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import axios from 'axios';
import { Check, X, Clock, User, Loader2, Calendar } from "lucide-react";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 FIX 1: useCallback prevents the function from being recreated on every render
  const fetchAppointments = useCallback(async () => {
  const token = localStorage.getItem("token");
  setLoading(true);

  try {
    const response = await axios.get("http://localhost:8083/api/doctor/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments(response.data);
  } catch (error) {
    // This is where we handle the error properly
    if (error.response) {
      // The server responded with a status (403, 404, 500, etc.)
      console.error("Server Error Status:", error.response.status);
      console.error("Server Error Data:", error.response.data);
      
      if (error.response.status === 403) {
        alert("Access Denied: Your account does not have Doctor permissions.");
      }
    } else if (error.request) {
      // The request was made but no response was received (Backend is down)
      console.error("Network Error: Backend is not reachable. Check if Spring Boot is running on port 8083.");
    } else {
      // Something else happened while setting up the request
      console.error("Error Message:", error.message);
    }
    setAppointments([]);
  } finally {
    setLoading(false);
  }
}, []);

  // 🟢 FIX 3: Dependency array now has fetchAppointments safely
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleAction = async (appointmentId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) return;
    
    try {
      // Backend expects: /doctor/appointments/{id}/confirm or /reject
      await api.put(`/doctor/appointments/${appointmentId}/${action}`);
      alert(`Appointment ${action}ed successfully!`);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      console.error("Action error:", err);
      alert("Failed to update appointment status.");
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-slate-500 font-medium">Loading your schedule...</p>
    </div>
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-2">
        <Calendar className="text-blue-600" /> My Appointments
      </h2>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Patient</th>
              <th className="p-4 font-semibold text-slate-700">Date & Time</th>
              <th className="p-4 font-semibold text-slate-700 text-center">Status</th>
              <th className="p-4 font-semibold text-slate-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* 🟢 FIX 4: Safety check before mapping */}
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-slate-400" />
                      {app.patientName || app.patient?.username || "Guest"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col text-sm">
                      <span className="font-bold text-slate-700">{app.appointmentDate}</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock size={12} /> {app.appointmentTime}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 
                      app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Show actions only if the appointment is PENDING */}
                      {app.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleAction(app.id, 'confirm')}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                            title="Accept"
                          >
                            <Check size={18} />
                          </button>
                          <button 
                            onClick={() => handleAction(app.id, 'reject')}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                            title="Reject"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-400">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}