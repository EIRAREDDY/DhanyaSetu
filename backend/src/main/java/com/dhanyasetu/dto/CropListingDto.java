package com.dhanyasetu.dto;

import com.dhanyasetu.model.CropListing;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @Builder
public class CropListingDto {
    private Long id;
    private Long farmerId;
    private String farmerName;
    private String cropName;
    private String category;
    private BigDecimal quantity;
    private String unit;
    private String qualityGrade;
    private BigDecimal pricePerUnit;
    private LocalDate harvestDate;
    private String state;
    private String district;
    private String villageOrCity;
    private String description;
    private String imageUrl;
    private CropListing.Status status;
    private LocalDateTime createdAt;

    public static CropListingDto from(CropListing c) {
        return CropListingDto.builder()
            .id(c.getId())
            .farmerId(c.getFarmer().getId())
            .farmerName(c.getFarmer().getFullName())
            .cropName(c.getCropName())
            .category(c.getCategory())
            .quantity(c.getQuantity())
            .unit(c.getUnit())
            .qualityGrade(c.getQualityGrade())
            .pricePerUnit(c.getPricePerUnit())
            .harvestDate(c.getHarvestDate())
            .state(c.getState())
            .district(c.getDistrict())
            .villageOrCity(c.getVillageOrCity())
            .description(c.getDescription())
            .imageUrl(c.getImageUrl())
            .status(c.getStatus())
            .createdAt(c.getCreatedAt())
            .build();
    }
}
