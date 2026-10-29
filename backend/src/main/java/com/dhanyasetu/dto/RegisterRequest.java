package com.dhanyasetu.dto;

import com.dhanyasetu.model.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank String fullName;
    @Email @NotBlank String email;
    @Pattern(regexp = "\\d{10}") String phone;
    @Size(min = 8) @NotBlank String password;
    @NotNull User.Role role;
    @NotBlank String state;
    @NotBlank String district;
    String villageOrCity;
}
