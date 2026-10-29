package com.dhanyasetu.repository;

import com.dhanyasetu.model.CropListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface CropListingRepository extends JpaRepository<CropListing, Long> {

    List<CropListing> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);

    long countByStatus(CropListing.Status status);

    @Query("SELECT c FROM CropListing c WHERE c.status = 'AVAILABLE' AND " +
           "(:search IS NULL OR LOWER(c.cropName) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:minPrice IS NULL OR c.pricePerUnit >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.pricePerUnit <= :maxPrice)")
    Page<CropListing> findMarketplace(
        @Param("search") String search,
        @Param("category") String category,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable);
}
