import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Clock, Trash2, Plus, Calendar as CalendarIcon, Loader2 } from "lucide-react";

export default function DoctorDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    availableDate: new Date().toISOString().split("T")[0],
    availableTime: "09:00:00"
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doctor/availability");
      setSlots(res.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // ✅ ADD SLOT
  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      // Backend expects @RequestBody DoctorAvailability
      await api.post("/doctor/availability", formData);
      alert("Slot added successfully!");
      fetchSlots(); // Refresh list
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to add slot";
      alert("Error: " + errorMsg);
    }
  };

  // ✅ RELEASE SLOT (The Fix)
  const handleRelease = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;

    try {
      // 1. Must be api.delete to match @DeleteMapping in Java
      // 2. We pass the slotId in the URL
      const response = await api.delete(`/doctor/availability/${slotId}`);
      
      // 3. Backend now returns JSON Map.of("message", "...") 
      alert(response.data.message);
      fetchSlots(); // Refresh list
    } catch (err) {
      // 4. Handle JSON error response from ResponseEntity
      const errorMsg = err.response?.data?.message || "Check network/console";
      console.error("Release error details:", err.response);
      alert("Failed to release slot: " + errorMsg);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-8">Doctor Dashboard</h2>

        {/* Create Slot Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="text-blue-600" size={20} /> Add Availability Slot
          </h3>
          <form onSubmit={handleAddSlot} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
              <input
                type="date"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.availableDate}
                onChange={(e) => setFormData({...formData, availableDate: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Time</label>
              <input
                type="time"
                step="1"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.availableTime}
                onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Create Slot
            </button>
          </form>
        </div>

        {/* Slots List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b bg-slate-50">
            <h3 className="font-semibold text-slate-700">My Availability History</h3>
          </div>
          
          {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></div>
          ) : (
            <div className="divide-y">
              {slots.length > 0 ? slots.map((slot) => (
                <div key={slot.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarIcon size={16} />
                      <span>{slot.availableDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={16} />
                      <span className="font-medium text-slate-800">{slot.availableTime}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      slot.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {slot.status}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleRelease(slot.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Slot"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400">No slots created yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}