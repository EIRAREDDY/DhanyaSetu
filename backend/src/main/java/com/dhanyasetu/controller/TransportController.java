package com.dhanyasetu.controller;

import com.dhanyasetu.dto.TransportAssignmentDto;
import com.dhanyasetu.model.User;
import com.dhanyasetu.service.TransportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportService transportService;

    @GetMapping("/assignments")
    public ResponseEntity<List<TransportAssignmentDto>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transportService.getAssignments(user.getId()));
    }

    @PatchMapping("/assignments/{id}/status")
    public ResponseEntity<TransportAssignmentDto> updateStatus(@PathVariable Long id,
                                                                @RequestBody Map<String, String> body,
                                                                @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transportService.updateStatus(id, body.get("status"), user));
    }
}
