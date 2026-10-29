package com.dhanyasetu.controller;

import com.dhanyasetu.dto.CropListingDto;
import com.dhanyasetu.service.CropService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final CropService cropService;

    @GetMapping("/crops")
    public ResponseEntity<Page<CropListingDto>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sort) {
        return ResponseEntity.ok(cropService.getMarketplace(search, category, minPrice, maxPrice, page, size, sort));
    }

    @GetMapping("/crops/{id}")
    public ResponseEntity<CropListingDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(cropService.getById(id));
    }
}
