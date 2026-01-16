import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Search, User, Stethoscope, ArrowRight, AlertCircle } from 'lucide-react';

const FindDoctors = () => {
    const [doctors, setDoctors] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                // Endpoint maps to PatientDoctorAvailabilityController
                const response = await api.get('/patient/doctors');
                setDoctors(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Unable to load doctors. Please ensure you are logged in.");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc => 
        (doc.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.specialization?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading our specialists...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            {/* Hero Header */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find a Specialist</h1>
                <p className="text-lg text-slate-600 mt-2">Access quality healthcare by booking with our verified medical staff.</p>
            </div>

            {/* Search Section */}
            <div className="relative mb-10 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by name, department, or specialization..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 text-xl font-medium">No doctors match your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <User size={28} />
                                </div>
                                <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Available
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-800 mb-1">Dr. {doctor.name}</h2>
                            
                            <div className="flex items-center gap-2 text-blue-600 mb-6">
                                <Stethoscope size={16} />
                                <span className="font-semibold text-sm">{doctor.specialization || "General Medicine"}</span>
                            </div>
                            
                            <button 
                                onClick={() => navigate(`/patient/book/${doctor.id}`)}
                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
                            >
                                Book Appointment <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FindDoctors;