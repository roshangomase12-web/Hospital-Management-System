import { useEffect, useState } from "react";
import api from "../../api/axios";
import axios from 'axios';
import { UserPlus, Trash2, Eye, Stethoscope, Search, Key, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    // --- 🟢 FIX 1: Initialize as empty array to prevent .map() crash ---
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/doctors'); 
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDoctors(); }, []);

    // --- 🟢 FIXED: Using 'id' everywhere inside this function ---
    const handleResetPassword = async (id) => {
        const newPass = prompt("Enter new password (min 6 characters):");
        
        if (!newPass) return;
        if (newPass.length < 6) {
            alert("Password is too short!");
            return;
        }

        try {
            // This 'id' now matches the 'id' in the parentheses above
            await api.post(`/admin/users/${id}/reset-password`, { password: newPass });
            alert("Password reset successfully!");
        } catch (error) {
            console.error("Reset failed:", error);
            alert("Failed to reset password: " + (error.response?.status || "Error"));
        }
    };

    const handleDelete = async (id) => {
  try {
        const token = localStorage.getItem('token'); // Or however you store your token
        await axios.delete(`http://localhost:8083/api/admin/doctors/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        // After deleting, refresh the list (assuming you have a fetchDoctors function)
        fetchDoctors(); 
        alert("Doctor deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
    alert("Error: " + (error.response?.data || "Could not delete doctor"));
}
};

    const filteredDoctors = doctors.filter(doc =>
        (doc.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.specialization || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    <Stethoscope className="text-blue-600" /> Manage Doctors
                </h2>
                <button onClick={() => navigate("/admin/create")} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg">
                    <UserPlus size={20} /> Add New Doctor
                </button>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Doctor Details</th>
                            <th className="p-4 font-semibold text-slate-700">Specialization</th>
                            <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-blue-600"/></td></tr>
                        ) : filteredDoctors.length === 0 ? (
                            <tr><td colSpan="3" className="p-10 text-center text-slate-500 italic">No doctors found.</td></tr>
                        ) : filteredDoctors.map(doc => (
                            <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800">Dr. {doc.name || doc.username}</span>
                                        <span className="text-xs text-slate-400">ID: {doc.id}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium uppercase border border-blue-100">
                                        {doc.specialization || "General Medicine"}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex justify-center gap-3">
                                        {/* View Schedule */}
                                        <button onClick={() => navigate(`/admin/doctors/${doc.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Schedule">
                                            <Eye size={18} />
                                        </button>

                                        {/* 🟢 FIXED: Pass 'doc.id' to the function */}
                                        <button onClick={() => handleResetPassword(doc.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Reset Password">
                                            <Key size={18} />
                                        </button>

                                        {/* Delete */}
                                        <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete Doctor">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}