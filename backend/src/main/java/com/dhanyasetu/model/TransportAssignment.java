package com.dhanyasetu.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transport_assignments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TransportAssignment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "transporter_id", nullable = false)
    private User transporter;

    @Column(nullable = false)
    private String pickupAddress;

    @Column(nullable = false)
    private String deliveryAddress;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.ASSIGNED;

    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    @CreationTimestamp
    private LocalDateTime assignedAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Status { ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED }
}
