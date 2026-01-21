import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Hourglass, XCircle } from "lucide-react";

export default function PatientMyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/patient/appointments")
      .then(res => setAppointments(res.data))
      .catch(err => console.error("Error loading appointments:", err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle size={14} />;
      case 'REJECTED': return <XCircle size={14} />;
      case 'PENDING': return <Hourglass size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.delete(`/patient/appointments/${appointmentId}`);
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      alert("Appointment Cancelled.");
    } catch (err) {
      alert("Failed to cancel: " + (err.response?.data?.message || "Error"));
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-slate-500">Loading your history...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">My Appointments</h2>
        <p className="text-slate-500">Track and manage your scheduled medical visits.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
          <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
          <p className="text-slate-500 text-lg font-medium">No bookings found yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map(a => (
            <div key={a.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <User size={24} />
                  </div>
                  <div>
                    {/* Note: changed a.doctor?.name to a.doctor?.username based on your model */}
                    <h3 className="font-bold text-slate-800 text-lg">Dr. {a.doctor?.user?.name || a.doctor?.username || "Specialist"}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {a.appointmentDate}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {a.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyle(a.status)}`}>
                    {getStatusIcon(a.status)}
                    {a.status}
                  </div>
                  
                  {/* FIXED: The Cancel button is now inside the loop where 'a' is defined */}
                  {a.status === 'PENDING' && (
                    <button 
                      onClick={() => cancelAppointment(a.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold underline"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}