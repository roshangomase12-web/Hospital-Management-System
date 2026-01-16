package com.hms.dto;

import jakarta.validation.constraints.NotBlank;


public class AdminCreateUserDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;

    private String name;
    private String specialization;

    // Standard Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    // ✅ FIXED: Added proper Name logic
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    // ✅ FIXED: Added proper Specialization logic
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}