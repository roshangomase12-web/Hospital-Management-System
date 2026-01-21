import { useEffect, useState } from "react";
import api from "../../api/axios"; 
import { Calendar, Clock, ClipboardList, Search, Check, X, AlertCircle } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // --- DATA FETCHING ---
  const fetchAppointments = async () => {
    try {
      setError(null);
      // FIX 1: Use the 'api' instance, not raw axios.
      // FIX 2: Point to the ADMIN endpoint, not the DOCTOR endpoint.
      const response = await api.get('/admin/appointments'); 
      setAppointments(response.data);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Could not load appointments. Ensure you are logged in as Admin.");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // --- STATUS UPDATE ---
  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      // FIX 3: Matches your Controller @PutMapping("/admin/appointments/{id}/status")
      await api.put(`/admin/appointments/${appointmentId}/status`, null, {
        params: { status: status } 
      });

      fetchAppointments(); // Refresh list
      alert(`Appointment ${status} successfully!`);
    } catch (error) {
      console.error("Update Error:", error);
      alert(error.response?.data?.message || "Failed to update status.");
    }
  };

  // --- SEARCH LOGIC ---
  const filtered = appointments.filter(app => 
    // Uses optional chaining to prevent crashes if patient/doctor name is missing
    app.patient?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800">
          <ClipboardList className="text-blue-600" /> Master Appointment List
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search Patient/Doctor..." 
            className="pl-10 pr-4 py-2 border rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 border border-red-100">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm font-semibold">
            <tr>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium">{app.patient?.name || app.patient?.username}</td>
                <td className="p-4 text-slate-600">
                   {/* Checks if doctor object exists, otherwise looks at the User mapped as doctor */}
                   Dr. {app.doctor?.name || app.doctor?.username || "Unassigned"}
                </td>
                <td className="p-4">
                  <div className="flex flex-col text-sm text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <Calendar size={12}/> {app.appointmentDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12}/> {app.appointmentTime}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    app.status === 'CONFIRMED' || app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    app.status === 'REJECTED' || app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    {app.status === 'PENDING' && (
                      <>
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'CONFIRMED')}
                          className="p-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg transition-all"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 italic">No appointments found.</div>
        )}
      </div>
    </div>
  );
}