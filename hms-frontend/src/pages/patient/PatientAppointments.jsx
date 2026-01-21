import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Calendar, Clock, Stethoscope, AlertCircle, Loader2, CheckCircle2, XCircle, Timer } from 'lucide-react';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyBookings = async () => {
            try {
                const res = await api.get('/patient/appointments');
                setAppointments(res.data);
            } catch (err) {
                console.error("Error fetching bookings", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBookings();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 size={16} />;
            case 'REJECTED': return <XCircle size={16} />;
            default: return <Timer size={16} />;
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-500 font-medium">Loading your bookings...</p>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <header className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-900">My Appointments</h2>
                    <p className="text-slate-500">Track the status of your medical consultation requests.</p>
                </header>

                <div className="grid gap-6">
                    {appointments.length > 0 ? appointments.map((app) => (
                        <div key={app.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-hover hover:shadow-md">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Stethoscope size={28} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">
                                        Dr. {app.doctor?.user?.username || "Medical Staff"}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-4 mt-1">
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                            <Calendar size={14} className="text-blue-500" />
                                            {app.appointmentDate}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                                            <Clock size={14} className="text-blue-500" />
                                            {app.appointmentTime?.slice(0, 5)} — {app.endTime?.slice(0, 5)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm uppercase tracking-wide ${getStatusStyle(app.status)}`}>
                                {getStatusIcon(app.status)}
                                {app.status}
                            </div>
                        </div>
                    )) : (
                        <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
                            <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500 text-lg font-medium">No appointments booked yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientAppointments;