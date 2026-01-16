package com.hms.controller;

import com.hms.model.Appointment;

import com.hms.service.AppointmentService;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentController {

    private final AppointmentService appointmentService;

    public DoctorAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
 // ❌ THIS WAS MISSING: The main view for the Doctor
    @GetMapping
    public List<Appointment> getDoctorAppointments(Authentication auth) {
        // auth.getName() gets the logged-in doctor's username
        return appointmentService.getDoctorAppointments(auth.getName());
    }

    @PutMapping("/{id}/approve")
    public Appointment approve(@PathVariable Long id) {
        // We removed the 'Authentication' argument here to match the Service
        return appointmentService.approve(id);
    }

    @PutMapping("/{id}/reject")
    public Appointment reject(@PathVariable Long id) {
        return appointmentService.reject(id);
    } 
}
