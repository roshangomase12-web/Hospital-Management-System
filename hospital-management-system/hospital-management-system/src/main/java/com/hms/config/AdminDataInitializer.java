package com.hms.config;

import com.hms.model.User;
import com.hms.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@gmail.com";
        Optional<User> adminOpt = userRepository.findByUsername(adminEmail);

        User admin;
        if (adminOpt.isPresent()) {
            admin = adminOpt.get();
            System.out.println("Updating existing Admin account...");
        } else {
            admin = new User();
            admin.setUsername(adminEmail);
            admin.setName("System Admin");
            System.out.println("Creating new Admin account...");
        }

        // FORCE RESET: This uses YOUR app's BCrypt bean
        admin.setPassword(passwordEncoder.encode("admin123")); 
        admin.setRole("ROLE_ADMIN");
        admin.setActive(true);

        userRepository.save(admin);
        
        System.out.println("✅ FORCE RESET COMPLETE: " + adminEmail + " is now active with password 'admin123'");
    }
}