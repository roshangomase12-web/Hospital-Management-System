import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserPlus, Trash2, Eye, Stethoscope, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  /// 1. Fetch Doctors from the correct Doctor-specific endpoint
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // ✅ Change this from /admin/users/recent to your doctor-specific API
      const res = await api.get("/admin/doctors/pending"); 
      // Note: If you want ALL doctors (not just pending), 
      // you might need a @GetMapping("/all") in your Java Controller
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 2. Handle Delete (Soft Delete/Deactivate)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this doctor from the active list?")) return;

    try {
      // This calls your softDeleteUser method in the backend
      await api.delete(`/admin/users/${id}`);
      alert("Doctor record updated successfully.");
      
      // Update local state so the doctor disappears from the list immediately
      setDoctors(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Error: Could not delete user. They may have active dependencies.");
    }
  };

  // 3. Search Filter Logic
  const filteredDoctors = doctors.filter(doc => 
    doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="text-blue-600" /> Manage Doctors
          </h2>
          <p className="text-slate-500 mt-1">Add, view, or remove medical staff from the system.</p>
        </div>
        
        <button 
          onClick={() => navigate("/admin/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <UserPlus size={20}/> Add New Doctor
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search by name or specialization..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-slate-600 font-semibold">Doctor Details</th>
              <th className="p-4 text-slate-600 font-semibold">Specialization</th>
              <th className="p-4 text-slate-600 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="3" className="p-10 text-center text-slate-400">Loading staff data...</td></tr>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map(doc => (
                <tr key={doc.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-lg">Dr. {doc.name || 'Unknown'}</span>
                      <span className="text-xs text-slate-400 font-mono italic">Login ID: {doc.username}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {doc.specialization || "General Staff"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center items-center gap-4">
                      <button 
  onClick={() => navigate(`/admin/doctors/${doc.id}`)} // ✅ This triggers the App.jsx route
  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors"
  title="View Schedule"
>
  <Eye size={18} /> Schedule
</button>
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold text-sm transition-colors"
                        title="Delete Doctor"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-slate-400">
                  No doctors found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}