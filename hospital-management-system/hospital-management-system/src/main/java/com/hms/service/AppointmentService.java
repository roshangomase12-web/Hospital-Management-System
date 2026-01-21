package com.hms.service;

import com.hms.model.*;

import java.util.stream.Collectors;
import com.hms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepo;
    private final DoctorAvailabilityRepository availabilityRepo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo; // 1. ADD THIS

    public AppointmentService(AppointmentRepository appointmentRepo, 
                            DoctorAvailabilityRepository availabilityRepo, 
                            UserRepository userRepo,
                            DoctorRepository doctorRepo) { // 2. INJECT THIS
        this.appointmentRepo = appointmentRepo;
        this.availabilityRepo = availabilityRepo;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo; // 3. INITIALIZE THIS
    }

    @Transactional
    public Appointment bookAppointment(Long availabilityId, String patientUsername) {
        // 1. Fetch Patient User
        User patient = userRepo.findByUsername(patientUsername)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. Fetch Time Slot
        DoctorAvailability slot = availabilityRepo.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability slot not found"));

        // 3. Check Slot Status
        if ("BOOKED".equalsIgnoreCase(slot.getStatus())) {
            throw new RuntimeException("This slot has already been reserved.");
        }

        // 4. Create Appointment
        Appointment app = new Appointment();
        app.setPatient(patient);
        
        // BRIDGE LOGIC: Get the User from the Doctor entity to satisfy the Appointment model
        if (slot.getDoctor() != null) {
            app.setDoctor(slot.getDoctor());
        } else {
            throw new RuntimeException("No User account linked to this Doctor.");
        }

        app.setAvailability(slot);
        app.setAppointmentDate(slot.getAvailableDate());
        app.setAppointmentTime(slot.getAvailableTime());
        app.setEndTime(slot.getEndTime());
        app.setStatus("PENDING");

        // 5. Update Slot and Save
        slot.setStatus("BOOKED");
        availabilityRepo.save(slot);
        
        return appointmentRepo.save(app);
    }

    @Transactional
    public void updateStatus(Long id, String status) {
        Appointment app = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        String upperStatus = status.toUpperCase();
        app.setStatus(upperStatus);
        
        // If rejected/cancelled, make the time slot public again
        if ("REJECTED".equals(upperStatus) || "CANCELLED".equals(upperStatus)) {
            DoctorAvailability slot = app.getAvailability();
            if (slot != null) {
                slot.setStatus("OPEN");
                availabilityRepo.save(slot);
            }
        }
        appointmentRepo.save(app);
    }
    
    

    // Support Methods
    public List<Appointment> getPatientAppointments(String username) {
        return appointmentRepo.findByPatientUsername(username);
    }

    public List<Appointment> getDoctorAppointments(String doctorUsername) {
        // Brute force: get everything and filter by doctor's user username
        return appointmentRepo.findAll().stream()
                .filter(app -> app.getDoctor() != null && 
                        app.getDoctor().getUser().getUsername().equalsIgnoreCase(doctorUsername))
                .toList();
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepo.findAll();
    }
}