import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Calendar, Clock, User, ClipboardList, Search } from "lucide-react";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/admin/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch all appointments");
    }
  };

  const filtered = appointments.filter(app => 
    app.patient?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
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

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100 text-slate-600 text-sm font-semibold">
            <tr>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium">{app.patient?.username}</td>
                <td className="p-4 text-slate-600">Dr. {app.doctor?.name || "Unassigned"}</td>
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
                    app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400">No appointments found matching your search.</div>
        )}
      </div>
    </div>
  );
}