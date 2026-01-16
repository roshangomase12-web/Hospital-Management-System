import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Search, User, Stethoscope } from "lucide-react";

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/doctors/list") // Or your specific doctor list endpoint
      .then(res => {
        const onlyDoctors = res.data.filter(u => u.role === "ROLE_DOCTOR");
        setDoctors(onlyDoctors);
      })
      .catch(err => console.error("Error fetching doctors", err));
  }, []);

  const filteredDoctors = doctors.filter(doc => 
    doc.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Find a Specialist</h1>
          <p className="text-slate-500">Book an appointment with our world-class doctors</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search doctors..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div key={doc.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <User className="text-blue-600" size={30} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Dr. {doc.username}</h3>
            <p className="text-blue-600 font-medium flex items-center gap-2 mt-1">
              <Stethoscope size={16} /> {doc.specialization || "General Physician"}
            </p>
            <button 
              onClick={() => navigate(`/patient/doctors/${doc.id}`)}
              className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              View Availability
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}