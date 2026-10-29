package com.dhanyasetu.controller;

import com.dhanyasetu.dto.AuthResponse;
import com.dhanyasetu.dto.OrderDto;
import com.dhanyasetu.service.AdminService;
import com.dhanyasetu.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<AuthResponse.UserDto>> users(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(adminService.getUsers(search, role, page, size));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<Void> toggleStatus(@PathVariable Long id,
                                              @RequestBody Map<String, Boolean> body) {
        adminService.toggleUserStatus(id, body.get("enabled"));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> orders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(orderService.getAll(page, size));
    }
}
