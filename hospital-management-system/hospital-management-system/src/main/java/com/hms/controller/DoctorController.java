package com.hms.controller;

import com.hms.model.Doctor;
import com.hms.service.DoctorService;
import com.hms.repository.DoctorRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List; // ✅ Correct Import


@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;
    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorService doctorService, DoctorRepository doctorRepository) {
        this.doctorService = doctorService;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/list")
    @PreAuthorize("hasAnyRole('ROLE_PATIENT', 'ROLE_ADMIN')")
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_DOCTOR')")
    public Doctor getCurrentDoctor(Authentication auth) {
        return doctorService.getDoctorByUsername(auth.getName());
    }
}