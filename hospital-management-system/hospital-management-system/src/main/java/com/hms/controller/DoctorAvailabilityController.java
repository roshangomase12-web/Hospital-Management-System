package com.hms.controller;

import com.hms.model.DoctorAvailability;
import com.hms.service.DoctorAvailabilityService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor/availability")
public class DoctorAvailabilityController {

    private final DoctorAvailabilityService availabilityService;

    public DoctorAvailabilityController(DoctorAvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping
    public ResponseEntity<?> addAvailability(
            @RequestBody DoctorAvailability availability,
            Authentication auth
    ) {
        try {
            // ✅ Now passes endTime to the service
            DoctorAvailability saved = availabilityService.addAvailability(
                    auth.getName(),
                    availability.getAvailableDate(), 
                    availability.getAvailableTime(),
                    availability.getEndTime() 
            );
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
    

    @GetMapping
    public ResponseEntity<List<DoctorAvailability>> getMyAvailability(Authentication auth) {
        return ResponseEntity.ok(availabilityService.getDoctorAvailability(auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id, Authentication auth) {
        try {
            availabilityService.deleteAvailability(id, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Slot released successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
    }
}