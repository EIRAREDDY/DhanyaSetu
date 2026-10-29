package com.dhanyasetu.controller;

import com.dhanyasetu.dto.CropListingDto;
import com.dhanyasetu.dto.CropListingRequest;
import com.dhanyasetu.model.User;
import com.dhanyasetu.service.CropService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@RequiredArgsConstructor
public class CropController {

    private final CropService cropService;

    @GetMapping("/my")
    public ResponseEntity<List<CropListingDto>> my(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cropService.getMyListings(user.getId()));
    }

    @PostMapping
    public ResponseEntity<CropListingDto> create(@Valid @RequestBody CropListingRequest req,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cropService.create(req, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CropListingDto> update(@PathVariable Long id,
                                                  @Valid @RequestBody CropListingRequest req,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cropService.update(id, req, user.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        cropService.delete(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
