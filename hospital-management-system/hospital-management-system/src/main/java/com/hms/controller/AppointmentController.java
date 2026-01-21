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

    @GetMapping("/doctor")
    public List<Appointment> doctorAppointments(Authentication auth) {
        return appointmentService.getDoctorAppointments(auth.getName());
    }

    @PutMapping("/{id}/approve")
    public void approve(@PathVariable Long id) {
        // Calls the shared status update method
        appointmentService.updateStatus(id, "APPROVED");
    }

    @PutMapping("/{id}/reject")
    public void reject(@PathVariable Long id) {
        // Calls the shared status update method
        appointmentService.updateStatus(id, "REJECTED");
    }
}