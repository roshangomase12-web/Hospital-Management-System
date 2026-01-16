package com.hms.controller;

import com.hms.model.User;
import com.hms.model.Appointment; // ✅ Added this import
import com.hms.repository.UserRepository;
import com.hms.repository.AppointmentRepository;
import com.hms.service.UserService;


import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminController(UserService userService, 
                           UserRepository userRepository, 
                           AppointmentRepository appointmentRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

 // Add this inside AdminController.java

    @GetMapping("/doctors/{doctorId}/appointments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Appointment>> getDoctorAppointmentsForAdmin(@PathVariable Long doctorId) {
        // We call the repository directly or via service to get appointments for a specific doctor
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    
    }

    // ✅ DASHBOARD STATS
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getStats() {
        return ResponseEntity.ok(Map.of(
            "doctors", userRepository.countByRole("ROLE_DOCTOR"),
            "patients", userRepository.countByRole("ROLE_PATIENT"),
            "appointments", appointmentRepository.count()
        ));
    }

    // ✅ CREATE STAFF
    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStaff(@RequestBody Map<String, String> payload) {
        try {
            String password = payload.get("password");
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of("message", "Password must be at least 6 characters"));
            }

            User savedUser = userService.createStaffUser(
                payload.get("username"),
                password,
                payload.get("role"),
                payload.get("name"),
                payload.get("specialization")
            );

            return ResponseEntity.ok(Map.of(
                "message", "User created successfully", 
                "id", savedUser.getId(),
                "username", savedUser.getUsername()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage()));
        }
    }

    // ✅ RECENT USERS
    @GetMapping("/users/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getRecentUsers() {
        return ResponseEntity.ok(userRepository.findAll()); 
    }

    // ✅ DELETE USER
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> softDeleteUser(@PathVariable Long id) {
        try {
            userService.softDeleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Error: " + e.getMessage()));
        }
    }
}