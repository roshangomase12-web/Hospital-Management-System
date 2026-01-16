package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
@PreAuthorize("hasRole('ADMIN')") // Changed to hasRole for consistency
public class AdminDoctorController {

    private final DoctorRepository doctorRepo;
    private final DoctorAvailabilityRepository availabilityRepo;

    public AdminDoctorController(DoctorRepository doctorRepo, DoctorAvailabilityRepository availabilityRepo) {
        this.doctorRepo = doctorRepo;
        this.availabilityRepo = availabilityRepo;
    }

    // =========================
    // VIEW DOCTOR SCHEDULE
    // =========================
    @GetMapping("/{doctorId}/availability")
    public List<DoctorAvailability> getDoctorAvailability(@PathVariable Long doctorId) {
        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + doctorId));
        return availabilityRepo.findByDoctor(doctor);
    }

    // =========================
    // VIEW PENDING DOCTORS
    // =========================
    @GetMapping("/pending")
    public List<Doctor> pendingDoctors() {
        return doctorRepo.findByApprovedFalse();
    }

    // =========================
    // APPROVE DOCTOR
    // =========================
    @PutMapping("/{id}/approve")
    public Doctor approve(@PathVariable Long id) {
        Doctor doctor = doctorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        doctor.setApproved(true);
        return doctorRepo.save(doctor);
    }
}