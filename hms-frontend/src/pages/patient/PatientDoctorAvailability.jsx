import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios"; 
import { Calendar, Clock, ChevronLeft } from "lucide-react";

export default function PatientDoctorAvailability() {
  const { id } = useParams();
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && id !== "undefined") {
      setLoading(true);
      api.get(`/patient/doctors/${id}/availability`)
        .then((res) => {
          setAvailabilities(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading slots", err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleBook = async (slot) => {
    const slotId = slot.id;
    const slotDate = slot.availableDate || slot.date; 
    const slotTime = slot.availableTime || slot.startTime || slot.time;

    try {
      await api.post(`/patient/appointments/book-with-time`, null, {
        params: {
          availabilityId: slotId,
          date: slotDate,
          time: slotTime
        }
      });
      
      alert("✨ Success! Appointment Booked.");
      navigate("/patient/appointments");
    } catch (err) {
      console.error("Booking Error:", err.response?.data);
      alert("Booking Failed: " + (err.response?.data?.message || "Error"));
    }
  };

  if (loading) return <div className="p-10 text-center">Loading available slots...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-blue-600 mb-4 hover:underline transition-all"
      >
        <ChevronLeft size={20} /> Back to Doctors
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Select a Time Slot</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {availabilities.length > 0 ? (
          availabilities.map((slot) => (
            <div key={slot.id} className="bg-white p-5 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <Calendar size={18} className="text-blue-500"/> 
                  {slot.availableDate || slot.date}
                </div>
                
                {/* ✅ Added End Time Display here */}
                <div className="flex items-center gap-4 text-sm font-medium">
                   <div className="flex items-center gap-2 text-green-600">
                      <Clock size={16} />
                      <span>Start: {slot.availableTime || slot.startTime}</span>
                   </div>
                   <div className="flex items-center gap-2 text-red-500">
                      <Clock size={16} />
                      <span>End: {slot.endTime || "Next Slot"}</span>
                   </div>
                </div>
              </div>

              <button 
                onClick={() => handleBook(slot)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-bold transition-all shadow-md active:scale-95"
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <div className="text-slate-400 text-center py-16 bg-white border-2 border-dashed rounded-2xl">
            <p className="text-lg font-medium">No slots available currently.</p>
          </div>
        )}
      </div>
    </div>
  );
}