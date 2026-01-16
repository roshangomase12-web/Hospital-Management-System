package com.hms.service;

import com.hms.model.Doctor;
import com.hms.model.User;
import com.hms.repository.DoctorRepository; // ✅ Added Import
import com.hms.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository; // ✅ Added this line
    private final PasswordEncoder passwordEncoder;

    // ✅ Update constructor to include DoctorRepository
    public UserService(UserRepository userRepository, 
                       DoctorRepository doctorRepository, 
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository; // ✅ Added this line
        this.passwordEncoder = passwordEncoder;
    }

    // ===============================
    // ADMIN -> CREATE STAFF (DOCTOR / ADMIN)
    // ===============================
    @Transactional
    public User createStaffUser(String username, String password, String role, String name, String specialization) {
        // 1. Save the User
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role); 
        user.setName(name);
        user.setSpecialization(specialization);
        
        User savedUser = userRepository.save(user);

        // 2. Now doctorRepository will work because it is injected
        if ("ROLE_DOCTOR".equals(role)) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser); // Link it to the user we just saved
            doctor.setSpecialization(specialization);
            doctor.setName(name);
            doctorRepository.save(doctor); 
        }

        return savedUser;
    }

    // ===============================
    // PATIENT SELF REGISTER
    // ===============================
    public User registerPatient(String username, String password) {
        if (userRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setName(username); // FIXED: Changed from setUsername to setName
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ROLE_PATIENT");
        user.setActive(true);

        return userRepository.save(user); 
    }

    // ===============================
    // ADMIN -> SOFT DELETE USER
    // ===============================
    public void softDeleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(false);   
        userRepository.save(user);
    }
}