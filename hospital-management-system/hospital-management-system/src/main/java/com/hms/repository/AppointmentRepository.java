package com.hms.repository;

import com.hms.model.Appointment;
import com.hms.model.Doctor;
import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // ✅ Added
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
	// ✅ Fixes the error in AppointmentService (Doctor view)
    List<Appointment> findByDoctor(Doctor doctor);

    // ✅ Fixes the error in AppointmentService (Patient view)
    List<Appointment> findByPatient(User patient);

    // ✅ Fixes the error in AdminController
    List<Appointment> findByDoctorId(Long doctorId);
    long count(); 
    
    
}