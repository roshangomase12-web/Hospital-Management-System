package com.hms.dto;

import java.time.LocalDate;


public class AppointmentResponseDTO {

    private Long id;
    private String patientUsername;
    private String doctorName;
    private LocalDate appointmentDate;
    private String status;

    public AppointmentResponseDTO(
            Long id,
            String patientUsername,
            String doctorName,
            LocalDate appointmentDate,
            String status
    ) {
        this.id = id;
        this.patientUsername = patientUsername;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getPatientUsername() {
        return patientUsername;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public String getStatus() {
        return status;
    }
}
