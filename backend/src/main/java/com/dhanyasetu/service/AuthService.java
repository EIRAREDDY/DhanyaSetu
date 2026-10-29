package com.dhanyasetu.service;

import com.dhanyasetu.dto.AuthResponse;
import com.dhanyasetu.dto.LoginRequest;
import com.dhanyasetu.dto.RegisterRequest;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.UserRepository;
import com.dhanyasetu.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }
        User user = User.builder()
            .fullName(req.getFullName())
            .email(req.getEmail())
            .phone(req.getPhone())
            .password(passwordEncoder.encode(req.getPassword()))
            .role(req.getRole())
            .state(req.getState())
            .district(req.getDistrict())
            .villageOrCity(req.getVillageOrCity())
            .build();
        userRepository.save(user);
        return buildResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!user.isEnabled()) throw new IllegalArgumentException("Account is disabled.");
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        return buildResponse(user);
    }

    private AuthResponse buildResponse(User user) {
        String token = jwtUtil.generate(user.getEmail(), user.getRole().name());
        return AuthResponse.builder()
            .token(token)
            .user(AuthResponse.UserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .state(user.getState())
                .district(user.getDistrict())
                .villageOrCity(user.getVillageOrCity())
                .enabled(user.isEnabled())
                .build())
            .build();
    }

    public void changePassword(User user, String currentPassword, String newPassword) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect.");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
