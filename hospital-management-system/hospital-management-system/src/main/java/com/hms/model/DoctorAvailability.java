package com.hms.model;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "doctor_availability")
public class DoctorAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // DOCTOR
    @ManyToOne
    @JsonIgnoreProperties({"user", "specialization", "approved"}) // ✅ Prevents deep nesting
    private Doctor doctor;
    
    private LocalTime endTime; // Add this if missing

    // DATE
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate availableDate;

    // TIME SLOT
    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime availableTime;

    // OPEN / BOOKED
    private String status;
    

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public LocalDate getAvailableDate() {
        return availableDate;
    }

    public void setAvailableDate(LocalDate availableDate) {
        this.availableDate = availableDate;
    }

    public LocalTime getAvailableTime() {
        return availableTime;
    }

    public void setAvailableTime(LocalTime availableTime) {
        this.availableTime = availableTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
