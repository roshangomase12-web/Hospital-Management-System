package com.hms.service;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import java.util.List;
import com.hms.model.User;
import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DoctorService {

	private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final DoctorAvailabilityRepository availabilityRepository; // 1. ADD THIS

    public DoctorService(DoctorRepository doctorRepository, 
                         UserRepository userRepository,
                         DoctorAvailabilityRepository availabilityRepository) { // 2. INJECT THIS
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.availabilityRepository = availabilityRepository;
    }
    

    public Doctor getDoctorByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
    

    @Transactional
    public Doctor updateDoctorProfile(String username, String newName, String specialization) {
        Doctor doctor = getDoctorByUsername(username);
        doctor.setName(newName);
        doctor.setSpecialization(specialization);
        return doctorRepository.save(doctor);
    }
    
 // FIXED METHOD FOR ADMIN SCHEDULE VIEW
    public List<DoctorAvailability> getDoctorSchedule(Long userId) {
        // Find user by ID (the ID coming from the Admin's click)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find the doctor profile linked to that user
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        // Get availability using the DOCTOR table ID
        return availabilityRepository.findByDoctorId(doctor.getId());
    }
    

    @Transactional
    public void deleteDoctorById(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        if (user != null) {
            userRepository.delete(user);
        }
        
    }
}