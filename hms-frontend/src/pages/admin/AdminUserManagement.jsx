import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Trash2, UserCheck, Shield } from "lucide-react";

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => api.get("/admin/users/recent").then(res => setUsers(res.data));
  
  useEffect(() => { fetchUsers(); }, []);

  const handleDeactivate = async (id) => {
    if(window.confirm("Deactivate this user?")) {
      await api.delete(`/admin/users/${id}`);
      fetchUsers(); // Refresh list
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Shield/> User Management</h2>
      <div className="bg-white rounded-xl shadow border">
        {users.map(u => (
          <div key={u.id} className="p-4 border-b flex justify-between items-center">
            <div>
              <p className="font-bold">{u.username}</p>
              <p className="text-sm text-gray-500">{u.role}</p>
            </div>
            {u.active ? (
              <button onClick={() => handleDeactivate(u.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                <Trash2 size={20}/>
              </button>
            ) : <span className="text-gray-400 italic text-sm">Deactivated</span>}
          </div>
        ))}
      </div>
    </div>
  );
}