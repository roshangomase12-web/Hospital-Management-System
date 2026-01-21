import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext"; // 1. Import useAuth
import { Clock, Trash2, Plus, Calendar as CalendarIcon, Loader2, CheckCircle, Activity } from "lucide-react";

export default function DoctorDashboard() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
 const [formData, setFormData] = useState({
  availableDate: new Date().toISOString().split("T")[0],
  availableTime: "09:00", // Removed :00
  endTime: "09:30"        // Removed :00
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
const handleCreateSlot = async () => {
    try {
        // Construct the object to match the Java Entity exactly
        const payload = {
            availableDate: slotDate,    // Must be "YYYY-MM-DD"
            availableTime: startTime,   // Must be "HH:mm" (e.g., "09:00")
            endTime: endTime,           // Must be "HH:mm" (e.g., "10:00")
            status: "OPEN"
        };
console.log("Sending payload:", payload); // Debugging

        const response = await api.post('/doctor/availability', payload);
        alert("Slot added successfully!");
        fetchSlots(); // Refresh the table
    } catch (err) {
        // This will print the EXACT error from Spring Boot in your console
        console.error("400 Error Response:", err.response?.data);
        alert("Error: " + (err.response?.data?.message || "Failed to add slot"));
    }
};

  useEffect(() => {
    fetchSlots();
  }, []);

 const handleAddSlot = async (e) => {
  e.preventDefault();
  try {
    // We send formData directly because its keys match your Java Entity exactly
    console.log("Sending payload:", formData); 

    await api.post("/doctor/availability", {
      ...formData,
      status: "OPEN"
    });

    alert("Slot added successfully!");
    fetchSlots(); // Refresh list
  } catch (err) {
    console.error("400 Error Details:", err.response?.data);
    alert("Error: " + (err.response?.data?.message || "Check time format (HH:mm)"));
  }
};

  const handleRelease = async (slotId) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    try {
      const response = await api.delete(`/doctor/availability/${slotId}`);
      alert(response.data.message);
      fetchSlots();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Error releasing slot"));
    }
  };

  const stats = {
    total: slots.length,
    open: slots.filter(s => s.status === 'OPEN').length,
    booked: slots.filter(s => s.status === 'BOOKED').length
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h2>
          <p className="text-slate-500">Manage your consultation hours and availability.</p>
        </header>

        {/* Mini Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Activity size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Slots</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><CheckCircle size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Available</p>
              <p className="text-2xl font-bold text-slate-800">{stats.open}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Clock size={24}/></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Booked</p>
              <p className="text-2xl font-bold text-slate-800">{stats.booked}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 sticky top-8">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Plus className="text-blue-600" size={20} /> New Slot
              </h3>
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    value={formData.availableDate}
                    onChange={(e) => setFormData({...formData, availableDate: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Start</label>
                    <input
                      type="time"
                      className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      value={formData.availableTime}
                      onChange={(e) => setFormData({...formData, availableTime: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">End</label>
                    <input
                      type="time"
                      className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100">
                  Create Slot
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">Availability Schedule</h3>
              </div>
              
              {loading ? (
                <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {slots.length > 0 ? slots.map((slot) => (
                    <div key={slot.id} className="p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                      <div className="flex gap-8 items-center">
                        <div className="text-center bg-slate-100 px-4 py-2 rounded-2xl">
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Date</p>
                          <p className="text-sm font-bold text-slate-700">{slot.availableDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Duration</p>
                          <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <Clock size={14} className="text-blue-500" />
                            {slot.availableTime.slice(0,5)} - {slot.endTime?.slice(0,5) || "--:--"}
                          </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          slot.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => handleRelease(slot.id)}
                        className="p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )) : (
                    <div className="p-20 text-center text-slate-400">
                      <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No availability slots configured yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}