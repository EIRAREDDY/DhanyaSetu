package com.dhanyasetu.controller;

import com.dhanyasetu.dto.AuthResponse;
import com.dhanyasetu.dto.LoginRequest;
import com.dhanyasetu.dto.RegisterRequest;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.UserRepository;
import com.dhanyasetu.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @GetMapping("/users/me")
    public ResponseEntity<AuthResponse.UserDto> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(AuthResponse.UserDto.builder()
            .id(user.getId()).fullName(user.getFullName()).email(user.getEmail())
            .phone(user.getPhone()).role(user.getRole()).state(user.getState())
            .district(user.getDistrict()).villageOrCity(user.getVillageOrCity())
            .enabled(user.isEnabled()).build());
    }
}
