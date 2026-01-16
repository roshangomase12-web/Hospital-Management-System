package com.hms.security;

import io.jsonwebtoken.Claims;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    // ⚠ MUST be at least 32 chars
    private static final String SECRET_KEY =
            "hms-secret-key-hms-secret-key-hms-secret";

    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 10; // 10 hours

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ CREATE TOKEN
    public String generateToken(String username, String role) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        
        String formattedRole = role.startsWith("ROLE_") ? role : "ROLE_" + role;
        claims.put("role", formattedRole);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ EXTRACT USERNAME
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // ✅ EXTRACT ROLE
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // ✅ VALIDATE TOKEN
    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
