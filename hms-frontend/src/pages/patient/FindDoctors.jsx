import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Search, User, Stethoscope, ArrowRight, AlertCircle, MapPin } from 'lucide-react';

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
                // Corrected endpoint to match Backend Controller
                const response = await api.get('/doctor/list');
                setDoctors(Array.isArray(response.data) ? response.data : []);
            } catch (err) {
                setError("Unable to load doctors. Please try again later.");
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-slate-500 font-medium animate-pulse">Scanning our medical network...</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Find a Specialist</h1>
                <p className="text-lg text-slate-600 mt-2">Book an appointment with our world-class medical team.</p>
            </div>

            <div className="relative mb-10 max-w-2xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search by name or specialization..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                                    Verified
                                </span>
                            </div>

                            <h2 className="text-xl font-bold text-slate-800">Dr. {doctor.name}</h2>
                            <div className="flex items-center gap-2 text-slate-500 mt-1 mb-6">
                                <Stethoscope size={14} />
                                <span className="text-sm font-medium">{doctor.specialization || "General Medicine"}</span>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => navigate(`/patient/book/${doctor.id}`)}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Book Visit <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {filteredDoctors.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-slate-400 text-lg">No specialists found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default FindDoctors;