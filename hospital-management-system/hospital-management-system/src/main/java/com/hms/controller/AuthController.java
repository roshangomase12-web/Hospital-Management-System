package com.hms.controller;

import com.hms.dto.LoginRequestDTO;
import com.hms.dto.RegisterRequestDTO;
import com.hms.model.User;
import com.hms.security.JwtUtil;
import com.hms.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil,
            UserService userService
    ) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }
    

 // ✅ PATIENT REGISTER
    @PostMapping("/register")
    public Map<String, String> register(@Valid @RequestBody RegisterRequestDTO request) {
        // If your RegisterRequestDTO has a getName() method, use it here.
        // If not, we pass request.getUsername() as the 'name' parameter.
        User user = userService.registerPatient(
                request.getUsername(),
                request.getPassword()
        );

        return Map.of("message", "Patient registered successfully");
    }
    

    // ✅ LOGIN
    @PostMapping("/login")
    public Map<String, String> login(
            @Valid @RequestBody LoginRequestDTO request
    ) {
        Authentication authentication =
                authenticationManager.authenticate(
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

        String token = jwtUtil.generateToken(username, role);

        return Map.of("token", token);
    }
    
}
