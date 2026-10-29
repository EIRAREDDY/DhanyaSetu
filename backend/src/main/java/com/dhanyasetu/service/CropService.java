package com.dhanyasetu.service;

import com.dhanyasetu.dto.CropListingDto;
import com.dhanyasetu.dto.CropListingRequest;
import com.dhanyasetu.model.CropListing;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.CropListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CropService {

    private final CropListingRepository cropRepo;

    public List<CropListingDto> getMyListings(Long farmerId) {
        return cropRepo.findByFarmerIdOrderByCreatedAtDesc(farmerId)
            .stream().map(CropListingDto::from).collect(Collectors.toList());
    }

    public CropListingDto create(CropListingRequest req, User farmer) {
        CropListing crop = CropListing.builder()
            .farmer(farmer)
            .cropName(req.getCropName())
            .category(req.getCategory())
            .quantity(req.getQuantity())
            .unit(req.getUnit())
            .qualityGrade(req.getQualityGrade())
            .pricePerUnit(req.getPricePerUnit())
            .harvestDate(req.getHarvestDate() != null ? LocalDate.parse(req.getHarvestDate()) : null)
            .state(req.getState())
            .district(req.getDistrict())
            .villageOrCity(req.getVillageOrCity())
            .description(req.getDescription())
            .build();
        return CropListingDto.from(cropRepo.save(crop));
    }

    public CropListingDto update(Long id, CropListingRequest req, Long farmerId) {
        CropListing crop = cropRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Crop not found."));
        if (!crop.getFarmer().getId().equals(farmerId)) {
            throw new SecurityException("Not authorized.");
        }
        crop.setCropName(req.getCropName());
        crop.setCategory(req.getCategory());
        crop.setQuantity(req.getQuantity());
        crop.setUnit(req.getUnit());
        crop.setQualityGrade(req.getQualityGrade());
        crop.setPricePerUnit(req.getPricePerUnit());
        crop.setHarvestDate(req.getHarvestDate() != null ? LocalDate.parse(req.getHarvestDate()) : null);
        crop.setState(req.getState());
        crop.setDistrict(req.getDistrict());
        crop.setVillageOrCity(req.getVillageOrCity());
        crop.setDescription(req.getDescription());
        return CropListingDto.from(cropRepo.save(crop));
    }

    public void delete(Long id, Long farmerId) {
        CropListing crop = cropRepo.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Crop not found."));
        if (!crop.getFarmer().getId().equals(farmerId)) {
            throw new SecurityException("Not authorized.");
        }
        cropRepo.delete(crop);
    }

    public Page<CropListingDto> getMarketplace(String search, String category, BigDecimal minPrice,
                                                BigDecimal maxPrice, int page, int size, String sort) {
        Sort s = switch (sort) {
            case "price_asc"  -> Sort.by("pricePerUnit").ascending();
            case "price_desc" -> Sort.by("pricePerUnit").descending();
            default           -> Sort.by("createdAt").descending();
        };
        return cropRepo.findMarketplace(
            search != null && !search.isBlank() ? search : null,
            category != null && !category.isBlank() ? category : null,
            minPrice, maxPrice,
            PageRequest.of(page, size, s)
        ).map(CropListingDto::from);
    }

    public CropListingDto getById(Long id) {
        return cropRepo.findById(id).map(CropListingDto::from)
            .orElseThrow(() -> new IllegalArgumentException("Crop not found."));
    }
}
