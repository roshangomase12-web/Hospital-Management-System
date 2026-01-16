package com.hms.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id") // This must match your DB column name
    private User patient;

    // ✅ FIXED: Changed type to 'Doctor' and fixed lowercase 'user' typo
    @ManyToOne
    private Doctor doctor; 

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    
    private String status; 

    @ManyToOne
    private DoctorAvailability availability;

    // ===== GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPatient() { return patient; }
    public void setPatient(User patient) { this.patient = patient; }

    // ✅ FIXED: Method now correctly returns and accepts 'Doctor' type
    public Doctor getDoctor() { 
        return doctor; 
    }

    public void setDoctor(Doctor doctor) { 
        this.doctor = doctor; 
    }

    public DoctorAvailability getAvailability() { 
        return availability; 
    }

    public void setAvailability(DoctorAvailability availability) { 
        this.availability = availability; 
    }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public LocalTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}