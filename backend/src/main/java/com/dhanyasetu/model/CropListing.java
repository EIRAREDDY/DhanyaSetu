package com.dhanyasetu.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_listings")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class CropListing {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    @Column(nullable = false)
    private String cropName;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantity;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private String qualityGrade;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    private LocalDate harvestDate;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String district;

    private String villageOrCity;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.AVAILABLE;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum Status { AVAILABLE, SOLD_OUT, INACTIVE }
}
