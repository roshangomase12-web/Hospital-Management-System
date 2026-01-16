package com.hms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private boolean approved = false;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"password", "role", "enabled", "authorities", "doctor", "username"})
    private User user;

    public Doctor() {}
    // Getters and Setters remain the same...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}