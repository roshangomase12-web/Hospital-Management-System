import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function PatientMyAppointments() {
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get("/patient/appointments").then(res => setList(res.data));
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
      {list.length === 0 ? <p className="text-gray-400">No appointments yet.</p> : (
        list.map(a => (
          <div key={a.id} className="mb-4 p-4 bg-white rounded-2xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">Dr. {a.doctor?.name || "General Doctor"}</h3>
                <p className="text-gray-500">{a.appointmentDate}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                a.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>{a.status}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}