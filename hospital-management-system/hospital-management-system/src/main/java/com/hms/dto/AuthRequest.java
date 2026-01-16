package com.hms.dto;

public class AuthRequest {

    private String username;
    private String password;

    // REQUIRED: no-args constructor
    public AuthRequest() {
    }

    // getters & setters
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
}
