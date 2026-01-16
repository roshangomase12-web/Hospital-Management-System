package com.hms.controller;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/secure")
    public Map<String, Object> secure(Authentication authentication) {

        return Map.of(
                "message", "JWT is working",
                "username", authentication.getName(),
                "roles", authentication.getAuthorities()
        );
    }
}
