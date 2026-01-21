package com.hms.security;

import com.hms.model.User;

import com.hms.repository.UserRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

    	User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    	// --- DEBUG LINES START ---
    	System.out.println("--- LOGIN ATTEMPT ---");
        System.out.println("DEBUG: Login attempt for: " + username);
        System.out.println("DEBUG: Raw Role from DB: " + user.getRole());
        System.out.println("DEBUG: Encrypted Password in DB: " + user.getPassword());
        // --- DEBUG LINES END ---
        
        // Ensure the role has ROLE_ prefix before giving it to Spring Security
        String roleWithPrefix= user.getRole().startsWith("ROLE_") ? 
                          user.getRole() : "ROLE_" + user.getRole();

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities(new SimpleGrantedAuthority(roleWithPrefix)) // 👈 USE roleWithPrefix HERE
                
                .build();
    }
}
