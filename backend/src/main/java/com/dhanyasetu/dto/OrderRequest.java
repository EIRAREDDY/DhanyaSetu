package com.dhanyasetu.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    @NotNull Long cropListingId;
    @NotNull @DecimalMin("0.01") BigDecimal quantity;
    @NotBlank String deliveryAddress;
}
