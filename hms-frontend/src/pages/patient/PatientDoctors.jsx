import { useEffect, useState } from "react";
import api from "../../api/axios"; // 👈 Use your central axios instance
import { useNavigate } from "react-router-dom";
import { User, Stethoscope, ArrowRight, Loader2 } from "lucide-react";

function PatientDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // We call the endpoint directly using our axios instance
    api.get("/patient/doctors")
      .then((res) => {
        setDoctors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load doctors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-2" />
        <p className="text-slate-500">Finding available doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Available Specialists</h2>
        <p className="text-slate-500">Select a doctor to view their available time slots</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.length > 0 ? (
          doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Stethoscope className="text-blue-600 w-6 h-6" />
                </div>
                <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                  Available
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-1">Dr. {doc.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{doc.specialization || "General Physician"}</p>
              
              <button 
                onClick={() => navigate(`/patient/doctors/${doc.id}`)}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 py-3 rounded-xl font-semibold transition-all"
              >
                View Availability
                <ArrowRight size={18} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <User className="mx-auto text-slate-300 w-12 h-12 mb-3" />
            <p className="text-slate-500 font-medium">No doctors are currently approved or available.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDoctors;