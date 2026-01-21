package com.hms.controller;

import com.hms.model.*;

import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository; // 1. Import it
import com.hms.service.*;

import jakarta.transaction.Transactional;

import com.hms.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController // <--- IMPORTANT: Make sure this is here!

@RequestMapping("/api/doctor")
@CrossOrigin(origins = "http://localhost:5173") // Ensure React can connect
public class DoctorController {

    private final DoctorService doctorService;
    
    private final DoctorRepository doctorRepository;
    private final AdminService adminService;
    private final AppointmentService appointmentService; 
    private final DoctorAvailabilityRepository availabilityRepository; // ✅ ADD THIS

    // FIXED: Added AppointmentService to the parameters and removed the extra {
    public DoctorController(DoctorService doctorService, 
            DoctorRepository doctorRepository, 
            AdminService adminService,
            AppointmentService appointmentService,
            DoctorAvailabilityRepository availabilityRepository) { // ✅ ADD THIS
this.doctorService = doctorService;
this.doctorRepository = doctorRepository;
this.adminService = adminService;
this.appointmentService = appointmentService;
this.availabilityRepository = availabilityRepository;
}

    @GetMapping("/my-appointments") // Change "appointments" to "my-appointments"
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')") 
    public ResponseEntity<List<Appointment>> getDoctorAppointments(Authentication auth) {
        List<Appointment> apps = adminService.getAppointmentsByUsername(auth.getName()); 
        return ResponseEntity.ok(apps);
    }
   
   @PutMapping("/appointments/{id}/status")
   @PreAuthorize("hasRole('DOCTOR')")
   public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestParam String status) {
       // Change '.updateAppointmentStatus' to '.updateStatus'
       appointmentService.updateStatus(id, status); 
       
       return ResponseEntity.ok(Map.of("message", "Status updated to " + status));
   }
   @GetMapping("/me")
   @PreAuthorize("hasRole('DOCTOR')")
   public ResponseEntity<?> getMyProfile(Authentication auth) {
       return doctorRepository.findByUserUsername(auth.getName())
           .<ResponseEntity<?>>map(doctor -> ResponseEntity.ok(doctor))
           .orElse(ResponseEntity.status(404).body(Map.of("message", "Profile not found")));
   }

    @PutMapping("/profile")
    @PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public Doctor updateProfile(@RequestBody Map<String, String> updates, Authentication auth) {
        return doctorService.updateDoctorProfile(
            auth.getName(), 
            updates.get("name"), 
            updates.get("specialization")
        );
    }
    


    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('PATIENT', 'ADMIN', 'DOCTOR')") // Use hasAnyRole for cleaner code
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .filter(Doctor::isApproved)
                .collect(Collectors.toList());
    }
}