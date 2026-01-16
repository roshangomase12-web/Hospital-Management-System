package com.hms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    
    @OneToOne(mappedBy = "user")
    @JsonIgnore // 👈 Add this to prevent infinite loops during JSON conversion
    private Doctor doctor;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String role;
    
    // ✅ ADD THESE FIELDS
    private String name;
    private String specialization;

    // ✅ SOFT DELETE FLAG
    private boolean active = true;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    // ✅ FIXED: ADDED ACTUAL LOGIC FOR NAME
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ✅ FIXED: ADDED ACTUAL LOGIC FOR SPECIALIZATION
    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}