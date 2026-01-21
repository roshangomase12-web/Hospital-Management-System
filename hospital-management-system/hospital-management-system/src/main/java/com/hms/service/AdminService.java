package com.hms.service;

import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import com.hms.repository.DoctorRepository; // Added this
import com.hms.repository.AppointmentRepository;
import com.hms.repository.DoctorAvailabilityRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminService {

	private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final PasswordEncoder passwordEncoder; // Corrected

    public AdminService(UserRepository userRepository, 
                        AppointmentRepository appointmentRepository, 
                        DoctorRepository doctorRepository,
                        DoctorAvailabilityRepository availabilityRepository,
                        PasswordEncoder passwordEncoder) { // Inject here
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository; 
        this.passwordEncoder = passwordEncoder; // Initialize properly
    }
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDoctors", userRepository.countByRole("ROLE_DOCTOR"));
        stats.put("totalPatients", userRepository.countByRole("ROLE_PATIENT"));
        stats.put("totalAdmins", userRepository.countByRole("ROLE_ADMIN"));
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("pendingAppointments", appointmentRepository.countByStatus("PENDING"));
        return stats;
    }

    public List<User> getAllPatients() {
        return userRepository.findByRole("ROLE_PATIENT");
    }
    
    public List<Appointment> getAppointmentsByUsername(String username) {
        return appointmentRepository.findByDoctorUsername(username);
    }
 // Inside AdminService.java
    public List<DoctorAvailability> getDoctorScheduleForAdmin(Long userId) {
        // 1. Find the User first
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the Doctor profile linked to that User
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // 3. Return the slots using the DOCTOR'S ID
        // This is the key: availability is linked to doctor_id, not user_id
        return availabilityRepository.findByDoctorId(doctor.getId());
    }
 // Add this method to AdminService.java
    public List<Appointment> getAppointmentsByUserIdForAdmin(Long userId) {
        // 1. Find User
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Find the Doctor profile linked to that User
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found for user: " + userId));

        // 3. Get appointments using the DOCTOR'S ID
        return appointmentRepository.findByDoctorId(doctor.getId());
    }

    public List<Map<String, Object>> getAllDoctorsWithSchedules() {
        List<User> doctorUsers = userRepository.findByRole("ROLE_DOCTOR");
        
        return doctorUsers.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("doctorName", user.getName());
            map.put("specialization", user.getSpecialization());

            Optional<Doctor> doctorProfile = doctorRepository.findByUser(user);

            if (doctorProfile.isPresent()) {
                List<DoctorAvailability> slots = availabilityRepository.findByDoctorId(doctorProfile.get().getId());
                map.put("slots", slots);
            } else {
                map.put("slots", new ArrayList<>()); // Return empty list if no profile exists
            }

            return map;
        }).collect(Collectors.toList());
    }
    public List<User> getAllStaff() {
        return userRepository.findByRole("ROLE_ADMIN");
    }

    public List<User> getAllDoctors() {
        return userRepository.findByRole("ROLE_DOCTOR");
    }


    @Transactional
    public void resetPassword(Long id, String newRawPassword) { // Added second parameter
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newRawPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteDoctor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointmentRepository.deleteByDoctorId(userId);
        
        if ("ROLE_DOCTOR".equals(user.getRole())) {
            Optional<Doctor> doctorOpt = doctorRepository.findByUserId(userId);
            
            if (doctorOpt.isPresent()) {
                Doctor doctor = doctorOpt.get();
                Long doctorId = doctor.getId();

                appointmentRepository.deleteByDoctorId(doctorId);

                availabilityRepository.deleteByDoctorId(doctorId);

                doctorRepository.delete(doctor);
            }
        }
        appointmentRepository.deleteByPatientId(userId);

        userRepository.flush(); // Force sync before final delete
        userRepository.delete(user);
    }
    @Transactional
    public void deletePatient(Long userId) {
        // 1. Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointmentRepository.deleteByPatientId(userId);

        userRepository.delete(user);
        
        userRepository.flush();
    }
    
    
    
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        appointmentRepository.deleteByPatientId(userId);
        appointmentRepository.deleteByDoctorId(userId);

        if ("ROLE_DOCTOR".equals(user.getRole())) {
            doctorRepository.findByUserId(userId).ifPresent(doctor -> {
                availabilityRepository.deleteByDoctorId(doctor.getId());
                doctorRepository.delete(doctor);
            });
        }

        userRepository.delete(user);
        userRepository.flush();
    }
}