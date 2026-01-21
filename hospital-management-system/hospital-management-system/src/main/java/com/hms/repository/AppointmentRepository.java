package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.User;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // 1. THIS IS THE CORRECT ONE
    // Since Appointment.doctor is a User, we just need 'doctor.username'
    List<Appointment> findByDoctorUsername(String username);

    // 2. Patient lookup
    List<Appointment> findByPatientUsername(String username);
    
    List<Appointment> findByStatus(String status);
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctorId(Long doctorId);

    long countByStatus(String status);

    @Modifying // Required for DELETE queries
    @Transactional
    void deleteByAvailabilityId(Long availabilityId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.patient.id = :patientId")
    void deleteByPatientId(@Param("patientId") Long patientId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
    void deleteByDoctorId(@Param("doctorId") Long doctorId);
}