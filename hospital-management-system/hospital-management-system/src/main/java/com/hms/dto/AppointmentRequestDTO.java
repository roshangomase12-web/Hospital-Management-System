package com.hms.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AppointmentRequestDTO {

    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate appointmentDate;

    @NotNull
    private Long patientId; // Added this

    @NotNull
    private Long slotId;    // Added this
    
    private String reason;

 // --- GETTERS AND SETTERS ---

    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }

    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

}
