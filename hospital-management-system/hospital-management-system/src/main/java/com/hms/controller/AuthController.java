package com.hms.controller;

import com.hms.dto.LoginRequestDTO;


import com.hms.dto.RegisterRequestDTO;
import com.hms.model.User;
import com.hms.repository.UserRepository;
import com.hms.security.JwtUtil;
import com.hms.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final com.hms.repository.UserRepository userRepo;
    

 // Update constructor to include them
    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, 
                          UserService userService, PasswordEncoder passwordEncoder, 
                          UserRepository userRepo) {
        this.authenticationManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.userRepo = userRepo;
    }
    
    

 // ✅ PATIENT REGISTER
    @PostMapping("/register")
    public Map<String, String> register(@Valid @RequestBody RegisterRequestDTO request) {
        userService.registerPatient(
                request.getUsername(),
                request.getPassword()
        );
        return Map.of("message", "Patient registered successfully");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String newPassword = request.get("newPassword");

        userService.updatePassword(username, newPassword);
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }
    
    

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );

            String username = authentication.getName();
            String role = authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority();

            // --- NEW CODE: Fetch the user to get their ID ---
            User user = userService.findByUsername(username); 
            Long userId = user.getId(); 
            // ------------------------------------------------

            String token = jwtUtil.generateToken(username, role);

            // ✅ Updated response map to include "id"
            return ResponseEntity.ok(Map.of(
                "token", token,
                "role", role,
                "username", username,
                "id", userId  // This is what React is looking for!
            ));

        } catch (org.springframework.security.core.AuthenticationException e) {
            // This catches wrong passwords and sends 401 to React
            return ResponseEntity.status(401).body(Map.of(
                "message", "Invalid username or password"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "message", "An unexpected error occurred"
            ));
        }
    }
}
    
    

