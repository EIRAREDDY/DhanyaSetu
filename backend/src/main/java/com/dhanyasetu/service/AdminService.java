package com.dhanyasetu.service;

import com.dhanyasetu.dto.AuthResponse;
import com.dhanyasetu.model.Order;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.CropListingRepository;
import com.dhanyasetu.repository.OrderRepository;
import com.dhanyasetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final OrderRepository orderRepo;
    private final CropListingRepository cropRepo;

    public Map<String, Object> getDashboard() {
        long totalUsers = userRepo.count();
        long farmers = userRepo.countByRole(User.Role.FARMER);
        long buyers = userRepo.countByRole(User.Role.BUYER);
        long transporters = userRepo.countByRole(User.Role.TRANSPORTER);
        long admins = userRepo.countByRole(User.Role.ADMIN);
        long activeListings = cropRepo.countByStatus(com.dhanyasetu.model.CropListing.Status.AVAILABLE);
        long totalOrders = orderRepo.count();
        long completedOrders = orderRepo.countByStatus(Order.Status.COMPLETED);
        long pendingOrders = orderRepo.countByStatus(Order.Status.PENDING);
        List<Map<String, Object>> monthly = orderRepo.monthlyOrderCounts().stream()
            .map(r -> Map.<String, Object>of("month", monthName((Number) r[0]), "count", r[1]))
            .collect(Collectors.toList());
        return Map.of(
            "totalUsers", totalUsers, "farmers", farmers, "buyers", buyers,
            "transporters", transporters, "admins", admins,
            "activeListings", activeListings, "totalOrders", totalOrders,
            "completedOrders", completedOrders, "pendingOrders", pendingOrders,
            "monthlyOrders", monthly
        );
    }

    public Page<AuthResponse.UserDto> getUsers(String search, String role, int page, int size) {
        User.Role roleEnum = (role != null && !role.equals("ALL")) ? User.Role.valueOf(role) : null;
        return userRepo.findByRoleAndSearch(roleEnum, search, PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(u -> AuthResponse.UserDto.builder()
                .id(u.getId()).fullName(u.getFullName()).email(u.getEmail())
                .phone(u.getPhone()).role(u.getRole()).state(u.getState())
                .district(u.getDistrict()).enabled(u.isEnabled()).build());
    }

    public void toggleUserStatus(Long userId, boolean enabled) {
        userRepo.findById(userId).ifPresent(u -> {
            u.setEnabled(enabled);
            userRepo.save(u);
        });
    }

    private String monthName(Number m) {
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        int idx = m.intValue() - 1;
        return (idx >= 0 && idx < 12) ? months[idx] : String.valueOf(m);
    }
}
