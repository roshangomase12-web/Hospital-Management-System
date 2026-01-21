import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, User, Key, Search, Loader2 } from "lucide-react";

export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // --- FETCHING PORTION: Fetches all but filters ONLY for Patients ---
// AdminPatients.jsx

const fetchPatients = async () => {
    try {
        setLoading(true); // Start loading
        const response = await api.get('/admin/users/patients');
        setPatients(response.data);
    } catch (error) {
        console.error("Error fetching patients:", error);
        // If it's 403, your token might be expired or role is wrong
        if (error.response?.status === 403) {
            alert("Session expired or unauthorized. Please login again.");
        }
    } finally {
        setLoading(false); // Stop loading regardless of success/fail
    }
};

    useEffect(() => { fetchPatients(); }, []);

    // --- PASSWORD RESET PORTION ---
    const handleResetPassword = async (userId) => {
        const newPass = prompt("Enter new password for patient (min 6 chars):");
        if (!newPass || newPass.length < 6) return alert("Password too short!");
        try {
            await api.post(`/admin/users/${userId}/reset-password`, { password: newPass });
            alert("Patient password updated successfully!");
        } catch (err) { alert("Error updating password"); }
    };

    // --- DEACTIVATE PORTION ---
    const handleDeactivate = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient record?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setPatients(prev => prev.filter(p => p.id !== id));
            alert("Patient record deactivated.");
        } catch (err) { alert("Deactivate failed"); }
    };

    // --- SEARCH LOGIC ---
    const filtered = patients.filter(p => 
        (p.name || p.username).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            {/* HEADER SECTION */}
            <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <User className="text-emerald-600" /> Patient Directory
            </h2>

            {/* SEARCH BAR SECTION */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or username..."
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* TABLE SECTION */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Patient Details</th>
                            <th className="p-4 font-semibold text-slate-700 text-center">Username</th>
                            <th className="p-4 text-center font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="p-20 text-center">
                                    <Loader2 className="animate-spin mx-auto text-emerald-500 mb-2" size={32} />
                                    <p className="text-slate-500">Loading patient database...</p>
                                </td>
                            </tr>
                        ) : filtered.length > 0 ? (
                            filtered.map(p => (
                                <tr key={p.id} className="border-b border-slate-100 hover:bg-emerald-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800">{p.name || "Unnamed Patient"}</span>
                                            <span className="text-xs text-slate-400 font-mono">DB_ID: {p.id}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-600 text-center font-medium">@{p.username}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => handleResetPassword(p.id)} 
                                                className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                                                title="Reset Password"
                                            >
                                                <Key size={18}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeactivate(p.id)} 
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Deactivate Patient"
                                            >
                                                <Trash2 size={18}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-20 text-center text-slate-400">
                                    No patients found in the system.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}