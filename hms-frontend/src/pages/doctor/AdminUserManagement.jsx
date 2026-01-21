import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Users, Trash2, Search, UserCheck } from "lucide-react";

export default function AdminUserManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/users/recent"); // Reuse the endpoint
      const onlyActivePatients = res.data.filter(u => 
        u.role === "ROLE_PATIENT" && u.active === true // Logic for visibility
      );
      setPatients(onlyActivePatients);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Deactivate this patient account?")) return;
    try {
      await api.delete(`/admin/users/${id}`); // Soft delete logic
      setPatients(prev => prev.filter(p => p.id !== id));
      alert("Patient account deactivated.");
    } catch (err) {
      alert("Failed to delete patient.");
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.name || p.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        <Users className="text-green-600" /> Patient Management
      </h2>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search patients by name or ID..."
          className="w-full pl-10 pr-4 py-3 border rounded-xl"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Username</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center">Loading...</td></tr>
            ) : filteredPatients.map(p => (
              <tr key={p.id} className="border-b hover:bg-slate-50">
                <td className="p-4 font-bold">{p.name || "N/A"}</td>
                <td className="p-4 text-slate-600">{p.username}</td>
                <td className="p-4 text-center">
                  <span className="flex items-center justify-center gap-1 text-green-600 text-sm font-medium">
                    <UserCheck size={16} /> Active
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleDeletePatient(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}