package com.hms.controller;

import com.hms.dto.AppointmentRequestDTO;
import org.springframework.security.core.Authentication; // Add this import
import java.util.List; // Add this import
import com.hms.model.*;
import com.hms.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/patient/appointments")
@CrossOrigin(origins = "http://localhost:5173") // Ensure React can talk to this
public class PatientAppointmentController {

    private final AppointmentRepository appointmentRepo;
    private final DoctorAvailabilityRepository availabilityRepo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;

    public PatientAppointmentController(AppointmentRepository appointmentRepo, 
                                        DoctorAvailabilityRepository availabilityRepo,
                                        UserRepository userRepo,
                                        DoctorRepository doctorRepo) {
        this.appointmentRepo = appointmentRepo;
        this.availabilityRepo = availabilityRepo;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }
    
    
    
    @GetMapping
    public ResponseEntity<List<Appointment>> getMyAppointments(Authentication authentication) {
        // The 'authentication.getName()' returns the username (email) of the logged-in patient
        String currentUsername = authentication.getName();
        
        // You need to ensure your AppointmentRepository has this method
        List<Appointment> appointments = appointmentRepo.findByPatientUsername(currentUsername);
        
        return ResponseEntity.ok(appointments);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        return appointmentRepo.findById(id).map(appointment -> {
            // 1. Get the availability slot associated with this appointment
            DoctorAvailability slot = appointment.getAvailability();
            if (slot != null) {
                // 2. Make the slot available again
                slot.setStatus("OPEN");
                availabilityRepo.save(slot);
            }
            
            // 3. Delete the appointment record
            appointmentRepo.delete(appointment);
            
            return ResponseEntity.ok(Map.of("message", "Appointment cancelled successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
    

    @PostMapping("/book")
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequestDTO request) {
        // 1. Get the specific availability slot
        DoctorAvailability slot = availabilityRepo.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Time slot no longer available"));

        // 2. Get the patient (User)
        User patient = userRepo.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 3. Get the doctor (Doctor entity)
        Doctor doctor = doctorRepo.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // 4. Create the Appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        
        // SUCCESS: Passing the Doctor entity satisfies the FK constraint
        appointment.setDoctor(doctor); 
        
        appointment.setAppointmentDate(slot.getAvailableDate());
        appointment.setAppointmentTime(slot.getAvailableTime());
        appointment.setEndTime(slot.getEndTime());
        appointment.setStatus("PENDING");
        appointment.setAvailability(slot);
        appointment.setReason(request.getReason()); 

        // 5. Update slot and save appointment
        slot.setStatus("BOOKED");
        availabilityRepo.save(slot);
        appointmentRepo.save(appointment);

        return ResponseEntity.ok(Map.of("message", "Appointment requested successfully"));
    }
}