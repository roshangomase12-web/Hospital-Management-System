package com.hms.controller;

import com.hms.service.AdminService;
import com.hms.service.AppointmentService; // Ensure this exists
import com.hms.model.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import com.hms.model.Appointment; // Ensure this exists
import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController

@RequestMapping("/api/admin") // REMOVED "/user" to match React calls
@PreAuthorize("hasRole('ADMIN')") // Changed to match your Filter
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final AppointmentService appointmentService;
    private final DoctorRepository doctorRepo; // Add this
    private final UserRepository userRepository; // ✅ ADD THIS LINE
    private final PasswordEncoder passwordEncoder; // ✅ ADD THIS LINE for hashing

 // ✅ FIXED: Constructor now accepts all 5 dependencies
    public AdminController(AdminService adminService, 
                           AppointmentService appointmentService,
                           DoctorRepository doctorRepo, // Add this here
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.appointmentService = appointmentService;
        this.doctorRepo = doctorRepo; // Assign it here
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }



    
    // Now accessible at: GET /api/admin/stats
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // Now accessible at: GET /api/admin/users/patients
    @GetMapping("/users/patients")
    public ResponseEntity<List<User>> getPatients() {
        return ResponseEntity.ok(adminService.getAllPatients());
    }

    @GetMapping("/users/staff")
    public ResponseEntity<List<User>> getStaff() {
        return ResponseEntity.ok(adminService.getAllStaff());
    }    

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<Map<String, String>> updateAppointmentStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        appointmentService.updateStatus(id, status); 
        return ResponseEntity.ok(Map.of("message", "Status updated successfully"));
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User newUser) {
        // 1. Capture the name directly from the request before anything else happens
        String nameToSave = newUser.getName(); 
        String specToSave = newUser.getSpecialization();
        
        // Debug: This will print in your IntelliJ console
        System.out.println("DEBUG: Name captured for Doctor: " + nameToSave);

        if (userRepository.existsByUsername(newUser.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists!"));
        }

        // 2. Hash and Save User
        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        if (!newUser.getRole().startsWith("ROLE_")) {
            newUser.setRole("ROLE_" + newUser.getRole().toUpperCase());
        }
        
        User savedUser = userRepository.save(newUser);
        
        // 3. Create Doctor Profile using the CAPTURED name
        if ("ROLE_DOCTOR".equals(savedUser.getRole())) {
            Doctor doctorProfile = new Doctor();
            doctorProfile.setUser(savedUser);
            
            // Use the local variables nameToSave and specToSave
            doctorProfile.setName(nameToSave); 
            doctorProfile.setSpecialization(specToSave);
            doctorProfile.setApproved(true);
            
            // This is where the 400 error happens if nameToSave is null
            doctorRepo.save(doctorProfile); 
        }
        
        return ResponseEntity.ok(Map.of("message", "Doctor created successfully"));
    }
    

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("password");
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Password too short");
        }
        
        // ✅ FIX: You must pass 'newPassword' here too
        adminService.resetPassword(id, newPassword); 
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    
    }   
    
 // Replace the old method around Line 115 with this:
    @GetMapping("/doctors/{id}/availability")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long id) {
        // 'id' here is the User ID passed from your Admin Dashboard
        List<DoctorAvailability> schedule = adminService.getDoctorScheduleForAdmin(id);
        return ResponseEntity.ok(schedule);
    }
    
    
    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id); // Use the role-aware method
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            // This returns the 400 error message to your React console
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/doctors/availability")
    public ResponseEntity<?> getAllDoctorSchedules() {
        // This should return doctors along with their available slots
        return ResponseEntity.ok(adminService.getAllDoctorsWithSchedules());
    }
    
    @DeleteMapping("/users/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePatient(@PathVariable Long id) {
        try {
            adminService.deletePatient(id);
            return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not delete patient: " + e.getMessage());
        }
    }

    @DeleteMapping("/doctors/{id}") // Ensure this matches the React URL
    public ResponseEntity<?> deleteDoctor(@PathVariable("id") Long id) {
        try {
            adminService.deleteDoctor(id);
            return ResponseEntity.ok().body(Map.of("message", "Doctor deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    	 @GetMapping("/appointments/all") 
    
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }
    	 
    	// Add this to AdminController.java
    	 @GetMapping("/doctors/{id}/appointments")
    	 public ResponseEntity<List<Appointment>> getDoctorAppointmentsForAdmin(@PathVariable Long id) {
    	     // 'id' is the User ID passed from the frontend
    	     return ResponseEntity.ok(adminService.getAppointmentsByUserIdForAdmin(id));
    	 }

    	
    	   
}