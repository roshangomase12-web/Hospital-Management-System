package com.hms.controller;

import com.hms.model.Appointment;
import com.hms.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
public class DoctorAppointmentController {
    private final AppointmentService appointmentService;

    public DoctorAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }
    

    @GetMapping("/appointments") // This makes the full path /api/doctor/appointments
    public ResponseEntity<?> getMyAppointments(Principal principal) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(principal.getName()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> changeStatus(@PathVariable Long id, @RequestParam String status) {
        appointmentService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated to " + status));
    }
}