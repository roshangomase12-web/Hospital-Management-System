package com.hms.controller;

import com.hms.model.DoctorAvailability;
import com.hms.service.DoctorAvailabilityService;
import org.springframework.http.ResponseEntity; // ✅ Added
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

    // ✅ FIXED: Returns ResponseEntity to avoid JSON parsing errors
    @PostMapping
    public ResponseEntity<?> addAvailability(
            @RequestBody DoctorAvailability availability,
            Authentication auth
    ) {
        try {
            DoctorAvailability saved = availabilityService.addAvailability(
                    auth.getName(),
                    availability.getAvailableDate(), 
                    availability.getAvailableTime()
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

    // ✅ NEW: Added the Release/Delete Slot endpoint
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlot(@PathVariable Long id, Authentication auth) {
        try {
            // auth.getName() provides the username of the logged-in doctor
        	availabilityService.deleteAvailability(id, auth.getName());
            
            return ResponseEntity.ok(Map.of("message", "Slot released successfully"));
        } catch (Exception e) {
            // This prevents "Unexpected end of JSON input" by sending a JSON error
            return ResponseEntity.status(400).body(Map.of("message", e.getMessage()));
        }
        }
}