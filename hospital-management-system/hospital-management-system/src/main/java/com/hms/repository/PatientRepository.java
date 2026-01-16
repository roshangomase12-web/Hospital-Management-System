package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
