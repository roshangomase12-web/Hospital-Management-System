import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, Shield, Key, Loader2 } from "lucide-react";

export default function AdminUserManagement() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users/staff'); 
            setAdmins(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
            if (error.response?.status === 403) {
                alert("Security Error: Access Denied.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleResetPassword = async (userId) => {
        const newPass = prompt("Enter new password for Admin (min 6 chars):");
        if (!newPass || newPass.length < 6) return alert("Invalid password length!");
        try {
            await api.post(`/admin/users/${userId}/reset-password`, { password: newPass });
            alert("Admin password updated!");
        } catch (err) { alert("Update failed"); }
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("Remove this Admin from system?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setAdmins(prev => prev.filter(u => u.id !== id));
            alert("Admin deactivated.");
        } catch (err) { alert("Error deactivating"); }
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20 text-slate-500">
            <Loader2 className="animate-spin mr-2" /> Loading Staff Data...
        </div>
    );

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border-t-4 border-purple-500">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-700">
                <Shield /> Admin Staff Directory
            </h3>
            {admins.length === 0 ? (
                <p className="text-gray-500 py-4">No admin staff found.</p>
            ) : (
                <div className="divide-y divide-gray-100">
                    {admins.map(u => (
                        <div key={u.id} className="py-4 flex justify-between items-center">
                            <div>
                                <p className="font-bold text-slate-800">{u.name || u.username}</p>
                                <p className="text-xs text-gray-400">ADMIN_ID: {u.id} | ROLE: {u.role}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleResetPassword(u.id)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"><Key size={18}/></button>
                                <button onClick={() => handleDeactivate(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}