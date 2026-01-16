package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient/doctors")
public class PatientDoctorAvailabilityController {

    private final DoctorRepository doctorRepo;
    private final DoctorAvailabilityRepository availabilityRepo;

    public PatientDoctorAvailabilityController(DoctorRepository doctorRepo, DoctorAvailabilityRepository availabilityRepo) {
        this.doctorRepo = doctorRepo;
        this.availabilityRepo = availabilityRepo;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        // ✅ Only return doctors approved by Admin
        List<Doctor> doctors = doctorRepo.findAll()
                .stream()
                .filter(Doctor::isApproved)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<List<DoctorAvailability>> getDoctorAvailability(@PathVariable Long doctorId) {
        return doctorRepo.findById(doctorId)
                .map(doctor -> {
                    // ✅ Only send slots that are currently OPEN and for the future
                    List<DoctorAvailability> openSlots = availabilityRepo.findByDoctor(doctor)
                            .stream()
                            .filter(a -> "OPEN".equalsIgnoreCase(a.getStatus()))
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(openSlots);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}