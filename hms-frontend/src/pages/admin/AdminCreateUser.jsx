import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom"; // 👈 Added navigation

export default function AdminCreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "", 
    password: "", 
   email: '',
    role: 'ROLE_DOCTOR', // Ensure it has the ROLE_ prefix
    name: '',
    specialization: ""
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Sending to Backend:", formData);
    try {
      // Sending data to backend
      const response = await api.post("/admin/users", formData);
      
      // Axios automatically parses JSON, so response.data will have our map
      alert(response.data.message || "Account Created!");
      
      // ✅ Redirect to doctor list so user sees the new data
      if(formData.role === "ROLE_DOCTOR") {
          navigate("/admin/doctors");
      } else {
          navigate("/admin");
      }
      
    } catch (err) {
     // This catches the "Password too short" error from Java
   console.error(err.response.data); // This will tell you EXACTLY what is wrong
      alert("Error: " + (err.response?.data?.message || "Verify all fields."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-lg bg-white shadow-xl rounded-2xl mt-10 mx-auto border border-slate-100">
      <h2 className="text-2xl font-bold mb-2 text-slate-800">Create Staff Account</h2>
      <p className="text-slate-500 mb-6 text-sm">Register a new Admin or Doctor into the system.</p>
      
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Username (Login ID)</label>
          <input 
            value={formData.username} 
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={e => setFormData({...formData, username: e.target.value})} 
            required 
            placeholder="e.g. jdoe_doc"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Password</label>
          <input 
            value={formData.password} 
            type="password" 
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={e => setFormData({...formData, password: e.target.value})} 
            required 
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Full Name</label>
          <input 
            value={formData.name} 
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={e => setFormData({...formData, name: e.target.value})} 
            required 
            placeholder="e.g. Dr. John Doe"
          />
        </div>
        
        <div>
          <label className="text-sm font-semibold text-slate-600 block mb-1">Role</label>
          <select 
            value={formData.role} 
            className="w-full p-2.5 border rounded-lg bg-slate-50" 
            onChange={e => setFormData({...formData, role: e.target.value})}
          >
            <option value="ROLE_DOCTOR">Doctor</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>

        {formData.role === "ROLE_DOCTOR" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-semibold text-slate-600 block mb-1">Specialization</label>
            <input 
              value={formData.specialization} 
              placeholder="e.g. Cardiology" 
              className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              onChange={e => setFormData({...formData, specialization: e.target.value})} 
              required 
            />
          </div>
        )}

        <button 
          disabled={loading}
          className={`w-full ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} text-white py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95 mt-4`}
        >
          {loading ? "Creating..." : "Register Staff Member"}
        </button>
      </form>
    </div>
  );
}