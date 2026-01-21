import { useEffect, useState } from "react";
import api from "../../api/axios";
import { User, Award, Save, Loader2, CheckCircle } from "lucide-react";

export default function DoctorProfile() {
  const [profile, setProfile] = useState({ name: "", specialization: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  

  useEffect(() => {
    api.get("/doctor/me")
      .then(res => {
        setProfile({ 
        // Use || "" to ensure that if the DB has null, it becomes an empty string
        name: res.data.name || "", 
        specialization: res.data.specialization || "" 
      });
        setLoading(false);
      });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/doctor/profile", profile);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-slate-800">My Profile</h2>
      
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-2xl flex items-center gap-2 border border-green-100">
            <CheckCircle size={20} /> {message}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Full Display Name</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Medical Specialization</label>
            <div className="relative">
              <Award className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input 
                type="text" 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={profile.specialization}
                onChange={(e) => setProfile({...profile, specialization: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {saving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}