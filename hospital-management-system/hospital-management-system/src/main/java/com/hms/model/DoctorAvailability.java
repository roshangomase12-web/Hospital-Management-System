package com.hms.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
public class DoctorAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Doctor doctor;

 // Inside DoctorAvailability.java

    @OneToOne(mappedBy = "availability", cascade = CascadeType.ALL, orphanRemoval = true)
    private Appointment appointment;
    
    @JsonFormat(pattern = "yyyy-MM-dd") // Format: 2024-05-20
    private LocalDate availableDate;

    @JsonFormat(pattern = "HH:mm")    // Format: 09:00
    private LocalTime availableTime;

    @JsonFormat(pattern = "HH:mm")    // Format: 10:00
    private LocalTime endTime;      // Added: End Time

    private String status; // "OPEN", "BOOKED"

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public LocalTime getAvailableTime() { return availableTime; }
    public void setAvailableTime(LocalTime availableTime) { this.availableTime = availableTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}