package com.hms.repository;

import com.hms.model.Doctor;


import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // For DoctorService & AvailabilityService
    Optional<Doctor> findByUser(User user);

    // Alternate safe version (by FK)
    Optional<Doctor> findByUser_Id(Long userId);

    // For AdminDoctorController
    List<Doctor> findByApprovedFalse();
}
