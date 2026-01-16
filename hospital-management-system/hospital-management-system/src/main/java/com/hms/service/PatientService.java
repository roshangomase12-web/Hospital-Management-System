package com.hms.service;

import java.util.List;

import org.springframework.stereotype.Service;
import com.hms.model.Patient;
import com.hms.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository repo;

    public PatientService(PatientRepository repo) {
        this.repo = repo;
    }

    public Patient save(Patient patient) {
        return repo.save(patient);
    }

    public List<Patient> getAll() {
        return repo.findAll();
    }
}
