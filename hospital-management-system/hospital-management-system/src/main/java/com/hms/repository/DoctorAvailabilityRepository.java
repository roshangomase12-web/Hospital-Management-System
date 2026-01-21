package com.hms.repository;

import com.hms.model.DoctorAvailability;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    // This naming convention (findBy + EntityField + Id) is standard for Spring Data JPA
    List<DoctorAvailability> findByDoctorId(Long doctorId);

    
 // In AppointmentRepository.java
    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
    void deleteByDoctorId(Long doctorId);


}
