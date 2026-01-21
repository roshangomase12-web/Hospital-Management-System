package com.hms.service;

import com.hms.model.Doctor;
import com.hms.model.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User createStaffUser(String username, String password, String role, String name, String specialization) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role); 
        user.setName(name);
        user.setSpecialization(specialization);
        user.setActive(true); // Ensures visibility in the UI
        
        User savedUser = userRepository.save(user);

        if ("ROLE_DOCTOR".equals(role)) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialization(specialization);
            doctor.setName(name);
            doctor.setApproved(true); // Automatically approves created doctors
            doctorRepository.save(doctor); 
        }
        return savedUser;
    }

    @Transactional
    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false); // Soft delete logic to keep history but hide from active UI
        
        doctorRepository.findByUser(user).ifPresent(doctor -> {
            doctor.setApproved(false); 
            doctorRepository.save(doctor);
        });   
        userRepository.save(user);
    }
    public void updatePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // This uses your existing BCrypt encoder
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User registerPatient(String username, String password) {
        User user = new User();
        user.setUsername(username);
        // CRITICAL: You must use passwordEncoder here!
        user.setPassword(passwordEncoder.encode(password)); 
        user.setRole("ROLE_PATIENT");
        return userRepository.save(user);
    }
 // Add this method to UserService.java
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }
}