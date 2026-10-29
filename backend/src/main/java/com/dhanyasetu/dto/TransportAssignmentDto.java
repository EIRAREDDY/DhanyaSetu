package com.dhanyasetu.dto;

import com.dhanyasetu.model.TransportAssignment;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data @Builder
public class TransportAssignmentDto {
    private Long id;
    private Long orderId;
    private String orderRef;
    private String cropName;
    private java.math.BigDecimal quantity;
    private String unit;
    private Long transporterId;
    private String transporterName;
    private String pickupAddress;
    private String deliveryAddress;
    private TransportAssignment.Status status;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    public static TransportAssignmentDto from(TransportAssignment a) {
        return TransportAssignmentDto.builder()
            .id(a.getId())
            .orderId(a.getOrder().getId())
            .orderRef(a.getOrder().getOrderRef())
            .cropName(a.getOrder().getCropListing().getCropName())
            .quantity(a.getOrder().getQuantity())
            .unit(a.getOrder().getUnit())
            .transporterId(a.getTransporter().getId())
            .transporterName(a.getTransporter().getFullName())
            .pickupAddress(a.getPickupAddress())
            .deliveryAddress(a.getDeliveryAddress())
            .status(a.getStatus())
            .assignedAt(a.getAssignedAt())
            .pickedUpAt(a.getPickedUpAt())
            .deliveredAt(a.getDeliveredAt())
            .build();
    }
}
