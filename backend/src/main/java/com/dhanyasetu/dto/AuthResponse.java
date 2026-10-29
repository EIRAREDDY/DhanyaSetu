package com.dhanyasetu.dto;

import com.dhanyasetu.model.User;
import lombok.Builder;
import lombok.Data;

@Data @Builder
public class AuthResponse {
    private String token;
    private UserDto user;

    @Data @Builder
    public static class UserDto {
        private Long id;
        private String fullName;
        private String email;
        private String phone;
        private User.Role role;
        private String state;
        private String district;
        private String villageOrCity;
        private boolean enabled;
    }
}
