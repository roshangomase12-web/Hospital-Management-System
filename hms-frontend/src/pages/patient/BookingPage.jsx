import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Calendar, Clock, ChevronLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const BookingPage = () => {
    const { doctorId } = useParams();
    const navigate = useNavigate();
    
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/patient/doctors/${doctorId}/availability`);
                setSlots(response.data);
            } catch (err) {
                setError("Could not load availability. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, [doctorId]);

    const handleBooking = async () => {
    if (!selectedSlot || !selectedSlot.id) {
            setError("Please select a time slot first.");
            return;
        }
        // 1. Try common individual keys
        let storedId = localStorage.getItem('userId') || localStorage.getItem('id') || localStorage.getItem('patientId');
        
        // 2. If not found, check if it's nested in a 'user' object string
        if (!storedId && localStorage.getItem('user')) {
            try {
                const userObj = JSON.parse(localStorage.getItem('user'));
                storedId = userObj.id || userObj.userId || userObj.patientId;
            } catch (e) {
                console.error("Failed to parse user object from localStorage", e);
            }
        }

        console.log("Debug: Found Patient ID:", storedId);

        if (!storedId) {
            setError("You must be logged in to book an appointment. (No user ID found in storage)");
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

         // 3. Construct Payload - Match AppointmentRequestDTO.java
            const payload = {
                slotId: Number(selectedSlot.id), 
                doctorId: Number(doctorId),
                patientId: Number(storedId),
                reason: "General Checkup",
                // Use optional chaining to prevent the "cannot read property" error
                appointmentDate: selectedSlot?.availableDate 
            };

            console.log("Sending Payload to Backend:", payload);

            await api.post('/patient/appointments/book', payload);
            
            setSuccess(true);
            // Redirect to list after success
            setTimeout(() => navigate('/patient/appointments'), 2000);
        } catch (err) {
            console.error("Booking Error Details:", err.response?.data);
            const serverMessage = err.response?.data?.message || err.response?.data?.error;
            setError(serverMessage || "Booking failed. The slot might have been taken.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="text-slate-600 font-medium">Checking available slots...</p>
        </div>
    );

    if (success) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
            <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-md border border-green-100">
                <CheckCircle2 className="text-green-500 mx-auto mb-6" size={80} />
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Request Sent!</h2>
                <p className="text-slate-600 mb-6">Your appointment request has been sent to the doctor for approval.</p>
                <p className="text-sm text-slate-400 italic">Redirecting to your bookings...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-slate-600 hover:text-blue-600 mb-8 transition-colors font-medium group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                    Back to Search
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-100">
                        <h1 className="text-2xl font-bold text-slate-900">Select an Appointment Slot</h1>
                        <p className="text-slate-500 mt-1">Please pick a time that works best for your consultation.</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl flex items-center gap-3">
                                <AlertCircle size={20} /> {error}
                            </div>
                        )}

                        {slots.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
                                <p className="text-slate-500 text-lg">No available slots for this doctor at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {slots.map((slot) => (
                                    <div 
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                                            selectedSlot?.id === slot.id 
                                            ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-50' 
                                            : 'border-slate-100 hover:border-slate-300 bg-white'
                                        }`}
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className={`p-3 rounded-xl ${selectedSlot?.id === slot.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 text-slate-800 font-bold mb-0.5">
                                                    {slot.availableDate}
                                                </div>
                                                <div className="text-slate-500 text-sm font-medium">
                                                    {slot.availableTime?.slice(0, 5)} — {slot.endTime?.slice(0, 5) || "End"}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedSlot?.id === slot.id && (
                                            <CheckCircle2 className="text-blue-600" size={24} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                            <button
                                type="button"
                                disabled={!selectedSlot || submitting}
                                onClick={handleBooking}
                                className={`px-10 py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                                    !selectedSlot || submitting 
                                    ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-200'
                                }`}
                            >
                                {submitting ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </div>
                                ) : 'Confirm Booking Request'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;