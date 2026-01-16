package com.hms.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class AppointmentRequestDTO {

    @NotNull
    private Long doctorId;

    @NotNull
    private LocalDate appointmentDate;

    private String reason;

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
