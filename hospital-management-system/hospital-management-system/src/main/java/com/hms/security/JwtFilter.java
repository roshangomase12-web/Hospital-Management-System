package com.hms.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (jwtUtil.validateToken(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
                    String username = jwtUtil.extractUsername(token);
                 // Inside doFilterInternal...
                    String role = jwtUtil.extractRole(token); 
                    String formattedRole = role.toUpperCase().startsWith("ROLE_") ? 
                                           role.toUpperCase() : "ROLE_" + role.toUpperCase();

                    // Load details
                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                 // DEBUG LINE: Check your console for this output!
                    System.out.println("Authenticated user authorities: " + userDetails.getAuthorities());
                    

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, 
                                    null,
                                    userDetails.getAuthorities() // 👈 Trust the UserDetails authorities!
                                    );
                    // ... rest of code
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    System.out.println("Authenticated: " + username + " [Role: " + formattedRole + "]");
                }
            } catch (Exception e) {
                System.out.println("JWT Filter Error: " + e.getMessage());
            }
        }
        
        filterChain.doFilter(request, response);
    }
}