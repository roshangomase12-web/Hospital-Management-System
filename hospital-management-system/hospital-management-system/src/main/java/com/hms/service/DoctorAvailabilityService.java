package com.hms.service;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import com.hms.model.User;
import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;

    public DoctorAvailabilityService(DoctorAvailabilityRepository availabilityRepo, DoctorRepository doctorRepo, UserRepository userRepo) {
        this.availabilityRepo = availabilityRepo;
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
    }

    public DoctorAvailability addAvailability(String username, LocalDate date, LocalTime time) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor entity not found"));

        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setAvailableDate(date);
        availability.setAvailableTime(time);
        availability.setStatus("OPEN");

        return availabilityRepo.save(availability);
    }

 // ✅ FIXED LINE 53: Clean Logic
    public List<DoctorAvailability> getDoctorAvailability(String doctorUsername) {
        Optional<User> userOpt = userRepo.findByUsername(doctorUsername);
        if (userOpt.isEmpty()) return List.of();

        Optional<Doctor> doctorOpt = doctorRepo.findByUser(userOpt.get());
        if (doctorOpt.isEmpty()) return List.of();

        // This line is now safe and won't cause mapping errors
        return availabilityRepo.findByDoctor(doctorOpt.get());
    }

    @Transactional
    public void deleteAvailability(Long id, String username) {
        DoctorAvailability availability = availabilityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        String ownerUsername = availability.getDoctor().getUser().getUsername();
        User currentUser = userRepo.findByUsername(username).orElseThrow();

        if (!ownerUsername.equals(username) && !currentUser.getRole().equals("ROLE_ADMIN")) {
            throw new RuntimeException("Unauthorized delete attempt.");
        }
        
        availabilityRepo.delete(availability);
    }
}