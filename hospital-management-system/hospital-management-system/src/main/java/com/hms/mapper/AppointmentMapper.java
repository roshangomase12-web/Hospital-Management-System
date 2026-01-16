package com.hms.mapper;

import com.hms.dto.AppointmentDTO;

import com.hms.model.Appointment;

public class AppointmentMapper {

    public static AppointmentDTO toDTO(Appointment a) {

        AppointmentDTO dto = new AppointmentDTO();

        dto.setAppointmentId(a.getId());
        dto.setAppointmentDate(a.getAppointmentDate());
        dto.setStatus(a.getStatus());

        if (a.getPatient() != null) {
            dto.setPatientId(a.getPatient().getId());
        }

        if (a.getDoctor() != null) {
            dto.setDoctorId(a.getDoctor().getId());
        }

        return dto;
    }
}
