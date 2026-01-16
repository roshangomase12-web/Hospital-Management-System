package com.hms.service;

import com.hms.model.Doctor;

import com.hms.model.User;
import com.hms.repository.DoctorRepository;
import com.hms.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository
    ) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    public Doctor getDoctorByUsername(String username) {

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
}
