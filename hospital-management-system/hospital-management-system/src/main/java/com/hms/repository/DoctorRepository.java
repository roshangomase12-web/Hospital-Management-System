package com.hms.repository;

import com.hms.model.Doctor;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    // Allows looking up doctor profile via the User account
    Optional<Doctor> findByUser(User user);
 // Find the doctor record (ID 8) using the User ID (ID 100)
    Optional<Doctor> findByUserId(Long userId);
 // 🟢 This is the missing piece!
 // FIX: Change findByUsername to findByUserUsername 
    // This tells JPA to look at doctor.user.username
    Optional<Doctor> findByUserUsername(String username);
}