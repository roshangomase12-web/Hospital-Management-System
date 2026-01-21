package com.hms.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List; // ✅ FIXED: Use java.util.List, not antlr

@Entity
@Table(name = "doctors")
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) // Changed back to false now that logic is fixed
    private String name; 

    private String username;
    private String specialization;
    private boolean approved = false;

    // ✅ Cascade delete handles the "Foreign Key" error you saw earlier
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DoctorAvailability> availabilities;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Appointment> appointments;
    
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnoreProperties({"password", "role", "enabled", "authorities", "doctor", "accountNonExpired", "accountNonLocked", "credentialsNonExpired"})
    private User user;

    public Doctor() {}
    
    // ===== FIXED GETTERS & SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // ✅ FIXED: These were using 'this.username' before!
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}