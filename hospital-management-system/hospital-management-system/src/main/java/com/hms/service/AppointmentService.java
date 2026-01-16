package com.hms.service;

import com.hms.model.*;
import com.hms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final DoctorAvailabilityRepository availabilityRepo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;

    public AppointmentService(
            AppointmentRepository appointmentRepo,
            DoctorAvailabilityRepository availabilityRepo,
            UserRepository userRepo,
            DoctorRepository doctorRepo
    ) {
        this.appointmentRepo = appointmentRepo;
        this.availabilityRepo = availabilityRepo;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }

    // ✅ Added for Admin Controller
    public List<Appointment> getAll() {
        return appointmentRepo.findAll();
    }

    // ✅ Added for Patient Controller
    public List<Appointment> getAppointmentsForPatient(String username) {
        User patient = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return appointmentRepo.findByPatient(patient);
    }

    public List<Appointment> getDoctorAppointments(String username) {
        User doctorUser = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Doctor doctor = doctorRepo.findByUser(doctorUser)
                .orElseThrow(() -> new RuntimeException("Doctor profile missing"));
                
        return appointmentRepo.findByDoctor(doctor);
    }

    @Transactional
    public Appointment approve(Long id) {
        Appointment appointment = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus("APPROVED");
        return appointmentRepo.save(appointment);
    }

    @Transactional
    public Appointment reject(Long id) {
        Appointment appointment = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (appointment.getAvailability() != null) {
            appointment.getAvailability().setStatus("OPEN");
            availabilityRepo.save(appointment.getAvailability());
        }
        
        appointment.setStatus("REJECTED");
        return appointmentRepo.save(appointment);
    }

    @Transactional
    public Appointment bookWithTime(Long availabilityId, String date, String time, String patientUsername) {
        User patient = userRepo.findByUsername(patientUsername)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        DoctorAvailability availability = availabilityRepo.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Availability not found"));

        Doctor doctorEntity = availability.getDoctor(); 

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctorEntity);
        appointment.setAvailability(availability);
        appointment.setAppointmentDate(LocalDate.parse(date));
        appointment.setAppointmentTime(LocalTime.parse(time));
        appointment.setStatus("PENDING");

        availability.setStatus("BOOKED");
        availabilityRepo.save(availability);

        return appointmentRepo.save(appointment);
    }
}