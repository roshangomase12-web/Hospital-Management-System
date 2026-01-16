import { useEffect, useState } from "react";
import api from "../../api/axios";
import { UserPlus, Trash2, CheckCircle, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      // Fetching doctors from the doctor profile endpoint
      const res = await api.get("/admin/users/recent");
      // Filter to only show users with ROLE_DOCTOR
      setDoctors(res.data.filter(u => u.role === "ROLE_DOCTOR"));
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  };

const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
        try {
            const response = await api.delete(`/admin/users/${id}`);
            
            // ✅ FIX: Don't call .json() if the status is 200 OK with no body
            if (response.status === 200) {
                alert("Doctor deleted successfully");
                fetchDoctors(); // Refresh the list
            }
        } catch (err) {
            console.error("Delete error", err);
            alert("Could not delete. Check if doctor has appointments.");
        }
    }
};

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Manage Doctors</h2>
          <p className="text-slate-500">View and manage hospital medical staff</p>
        </div>
        <button 
          onClick={() => navigate("/admin/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <UserPlus size={20} /> Add New Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 text-slate-600 font-semibold">Doctor Name</th>
              <th className="p-4 text-slate-600 font-semibold">Specialization</th>
              <th className="p-4 text-slate-600 font-semibold">System ID</th>
              <th className="p-4 text-slate-600 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {doctors.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Stethoscope size={20} />
                  </div>
                  <span className="font-medium text-slate-700">Dr. {doc.username}</span>
                </td>
                <td className="p-4">
                  <span className="text-slate-600 italic">Medical Staff</span>
                </td>
                <td className="p-4 text-slate-500 font-mono text-sm">#{doc.id}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Doctor"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {doctors.length === 0 && (
          <div className="p-10 text-center text-slate-400">
            No doctors found in the system.
          </div>
        )}
      </div>
    </div>
  );
}