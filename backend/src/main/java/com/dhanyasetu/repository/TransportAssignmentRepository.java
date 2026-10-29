package com.dhanyasetu.repository;

import com.dhanyasetu.model.TransportAssignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransportAssignmentRepository extends JpaRepository<TransportAssignment, Long> {
    List<TransportAssignment> findByTransporterIdOrderByAssignedAtDesc(Long transporterId);
    Optional<TransportAssignment> findByOrderId(Long orderId);
    boolean existsByOrderId(Long orderId);
}
