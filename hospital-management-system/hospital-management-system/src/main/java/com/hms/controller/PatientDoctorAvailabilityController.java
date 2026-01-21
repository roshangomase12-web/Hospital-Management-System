package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import com.hms.model.User;
import com.hms.repository.DoctorAvailabilityRepository;
import com.hms.repository.DoctorRepository;
import com.hms.service.DoctorAvailabilityService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/patient/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientDoctorAvailabilityController {

    private final DoctorRepository doctorRepo;
    private final DoctorAvailabilityRepository availabilityRepo;
    @Autowired
    private DoctorAvailabilityService availabilityService;

    public PatientDoctorAvailabilityController(DoctorRepository doctorRepo, DoctorAvailabilityRepository availabilityRepo) {
        this.doctorRepo = doctorRepo;
        this.availabilityRepo = availabilityRepo;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        // Only return doctors approved by Admin
        List<Doctor> doctors = doctorRepo.findAll()
                .stream()
                .filter(Doctor::isApproved)
                .collect(Collectors.toList());
        return ResponseEntity.ok(doctors);
    }
 // Change the mapping to just "/availability"
    @GetMapping("/availability")
    public ResponseEntity<List<User>> getAllDoctorsWithSchedules() {
        List<User> doctors = availabilityService.findDoctorsWithActiveSlots();
        return ResponseEntity.ok(doctors);
    }
    

    @GetMapping("/{doctorId}/availability")
    public ResponseEntity<List<DoctorAvailability>> getDoctorAvailability(@PathVariable Long doctorId) {
        return doctorRepo.findById(doctorId)
                .map(doctor -> {
                    // FIXED LINE 39: Pass doctor.getId() instead of the doctor object
                    List<DoctorAvailability> openSlots = availabilityRepo.findByDoctorId(doctor.getId())
                            .stream()
                            .filter(a -> "OPEN".equalsIgnoreCase(a.getStatus()) || "AVAILABLE".equalsIgnoreCase(a.getStatus()))
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(openSlots);
                })
                .orElse(ResponseEntity.notFound().build());
    }
   
}