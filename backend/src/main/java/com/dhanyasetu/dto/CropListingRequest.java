package com.dhanyasetu.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CropListingRequest {
    @NotBlank String cropName;
    @NotBlank String category;
    @NotNull @DecimalMin("0.01") BigDecimal quantity;
    @NotBlank String unit;
    @NotBlank String qualityGrade;
    @NotNull @DecimalMin("0.01") BigDecimal pricePerUnit;
    String harvestDate;
    @NotBlank String state;
    @NotBlank String district;
    String villageOrCity;
    String description;
}
