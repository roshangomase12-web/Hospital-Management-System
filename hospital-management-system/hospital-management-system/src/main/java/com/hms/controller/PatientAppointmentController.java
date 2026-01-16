package com.hms.controller;

import com.hms.model.Appointment;

import com.hms.service.AppointmentService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/appointments")
public class PatientAppointmentController {

    private final AppointmentService appointmentService;

    public PatientAppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    // ✅ VIEW MY APPOINTMENTS
    @GetMapping
    public List<Appointment> myAppointments(Authentication auth) {
    	// ✅ This must match the method name in AppointmentService.java
        return appointmentService.getAppointmentsForPatient(auth.getName());
    }

    // ✅ BOOK USING AVAILABILITY + TIME
    @PostMapping("/book-with-time")
    public Appointment book(
            @RequestParam Long availabilityId,
            @RequestParam String date,
            @RequestParam String time,
            Authentication auth
    ) {
        return appointmentService.bookWithTime(
                availabilityId,
                date,
                time,
                auth.getName()
        );
    }
}
