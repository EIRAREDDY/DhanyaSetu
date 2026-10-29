package com.dhanyasetu.controller;

import com.dhanyasetu.dto.OrderDto;
import com.dhanyasetu.dto.OrderRequest;
import com.dhanyasetu.model.User;
import com.dhanyasetu.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public ResponseEntity<OrderDto> create(@Valid @RequestBody OrderRequest req,
                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.create(req, user));
    }

    @GetMapping("/orders")
    public ResponseEntity<Page<OrderDto>> list(
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User user) {
        Page<OrderDto> result = switch (user.getRole()) {
            case FARMER -> orderService.getForFarmer(user.getId(), page, size);
            case BUYER  -> orderService.getForBuyer(user.getId(), page, size);
            case ADMIN  -> orderService.getAll(page, size);
            default     -> Page.empty();
        };
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderDto> updateStatus(@PathVariable Long id,
                                                  @RequestBody Map<String, String> body,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("status"), user));
    }

    @GetMapping("/farmer/dashboard")
    public ResponseEntity<Map<String, Object>> farmerDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getFarmerDashboard(user.getId()));
    }

    @GetMapping("/buyer/dashboard")
    public ResponseEntity<Map<String, Object>> buyerDashboard(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getBuyerDashboard(user.getId()));
    }
}
