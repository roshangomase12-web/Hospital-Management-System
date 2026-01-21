package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.hms.model.Patient;

import jakarta.transaction.Transactional;

public interface PatientRepository extends JpaRepository<Patient, Long> {
	// In AppointmentRepository.java
	@Modifying
	@Transactional
	@Query("DELETE FROM Appointment a WHERE a.doctor.id = :doctorId")
	void deleteByDoctorId1(Long doctorId);

	
}
