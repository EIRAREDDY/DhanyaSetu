package com.dhanyasetu.dto;

import com.dhanyasetu.model.Order;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data @Builder
public class OrderDto {
    private Long id;
    private String orderRef;
    private Long buyerId;
    private String buyerName;
    private Long farmerId;
    private String farmerName;
    private Long cropListingId;
    private String cropName;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private String deliveryAddress;
    private Order.Status status;
    private Order.PaymentStatus paymentStatus;
    private String transportStatus;
    private LocalDateTime createdAt;

    public static OrderDto from(Order o) {
        return OrderDto.builder()
            .id(o.getId())
            .orderRef(o.getOrderRef())
            .buyerId(o.getBuyer().getId())
            .buyerName(o.getBuyer().getFullName())
            .farmerId(o.getFarmer().getId())
            .farmerName(o.getFarmer().getFullName())
            .cropListingId(o.getCropListing().getId())
            .cropName(o.getCropListing().getCropName())
            .quantity(o.getQuantity())
            .unit(o.getUnit())
            .unitPrice(o.getUnitPrice())
            .totalAmount(o.getTotalAmount())
            .deliveryAddress(o.getDeliveryAddress())
            .status(o.getStatus())
            .paymentStatus(o.getPaymentStatus())
            .createdAt(o.getCreatedAt())
            .build();
    }
}
