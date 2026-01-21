package com.hms.service;

import com.hms.model.Doctor;
import com.hms.repository.AppointmentRepository; // ✅ Added this
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
import java.util.stream.Collectors;

@Service
public class DoctorAvailabilityService {

    private final DoctorAvailabilityRepository availabilityRepo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;
    private final AppointmentRepository appointmentRepo;
    

    public DoctorAvailabilityService(DoctorAvailabilityRepository availabilityRepo, 
            DoctorRepository doctorRepo, 
            UserRepository userRepo,
            AppointmentRepository appointmentRepository) { // ✅ Injected this        this.availabilityRepo = availabilityRepo;
    	this.availabilityRepo = availabilityRepo;
        this.doctorRepo = doctorRepo;
        this.userRepo = userRepo;
        this.appointmentRepo = appointmentRepository;
    }

    public DoctorAvailability addAvailability(String username, LocalDate date, LocalTime startTime, LocalTime endTime) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepo.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor entity not found"));

        DoctorAvailability availability = new DoctorAvailability();
        availability.setDoctor(doctor);
        availability.setAvailableDate(date);
        availability.setAvailableTime(startTime);
        availability.setEndTime(endTime); 
        availability.setStatus("OPEN");

        return availabilityRepo.save(availability);
    }

    public List<DoctorAvailability> getDoctorAvailability(String doctorUsername) {
        Optional<User> userOpt = userRepo.findByUsername(doctorUsername);
        if (userOpt.isEmpty()) return List.of();

        Optional<Doctor> doctorOpt = doctorRepo.findByUser(userOpt.get());
        if (doctorOpt.isEmpty()) return List.of();

        // FIXED LINE 53: Pass the ID to match the Repository method
        return availabilityRepo.findByDoctorId(doctorOpt.get().getId());
    }

    @Transactional
    public void deleteAvailability(Long id, String username) {
        DoctorAvailability availability = availabilityRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // Security: Check ownership
        if (!availability.getDoctor().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized delete attempt.");
        }

        // 1. ✅ DELETE APPOINTMENT FIRST (Fixes the SQL Foreign Key Error)
        appointmentRepo.deleteByAvailabilityId(id);        
        
        // 2. DELETE SLOT
        availabilityRepo.delete(availability);
    }
    public List<User> findDoctorsWithActiveSlots() {
        // 1. Fetch all availability slots that are OPEN
        List<DoctorAvailability> activeSlots = availabilityRepo.findAll().stream()
                .filter(a -> "OPEN".equalsIgnoreCase(a.getStatus()) || "AVAILABLE".equalsIgnoreCase(a.getStatus()))
                .collect(Collectors.toList());

        // 2. Extract the unique Doctors (Users) from those slots
        return activeSlots.stream()
                .map(slot -> slot.getDoctor().getUser()) // Adjust based on your Entity relationships
                .distinct()
                .collect(Collectors.toList());
    }
}