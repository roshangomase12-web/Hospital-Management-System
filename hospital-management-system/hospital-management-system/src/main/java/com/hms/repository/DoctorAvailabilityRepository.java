package com.hms.repository;

import com.hms.model.Doctor;
import com.hms.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List; // ✅ MUST BE THIS IMPORT

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    
    // This method name must match exactly what you call in the Service
    List<DoctorAvailability> findByDoctor(Doctor doctor);
}