package com.hms.controller;

import com.hms.model.Appointment;

import com.hms.service.AppointmentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ======================
    // DOCTOR → VIEW
    // ======================
    @GetMapping("/doctor")
    public List<Appointment> doctorAppointments(Authentication auth) {
        return appointmentService.getDoctorAppointments(auth.getName());
    }

    // ======================
    // DOCTOR → APPROVE
    // ======================
    @PutMapping("/{id}/approve")
    public Appointment approve(
            @PathVariable Long id,
            Authentication auth
    ) {
        return appointmentService.approve(id);
    }

    // ======================
    // DOCTOR → REJECT
    // ======================
    @PutMapping("/{id}/reject")
    public Appointment reject(
            @PathVariable Long id,
            Authentication auth
    ) {
        return appointmentService.reject(id);
    }
}
