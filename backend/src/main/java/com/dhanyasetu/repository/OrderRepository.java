package com.dhanyasetu.repository;

import com.dhanyasetu.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByBuyerIdOrderByCreatedAtDesc(Long buyerId, Pageable pageable);
    Page<Order> findByFarmerIdOrderByCreatedAtDesc(Long farmerId, Pageable pageable);

    long countByBuyerIdAndStatus(Long buyerId, Order.Status status);
    long countByFarmerIdAndStatus(Long farmerId, Order.Status status);
    long countByStatus(Order.Status status);

    @Query("SELECT COALESCE(SUM(o.totalAmount),0) FROM Order o WHERE o.buyer.id = :buyerId AND o.status = 'COMPLETED'")
    BigDecimal sumCompletedByBuyer(Long buyerId);

    @Query("SELECT COALESCE(SUM(o.totalAmount),0) FROM Order o WHERE o.farmer.id = :farmerId AND o.status = 'COMPLETED'")
    BigDecimal sumCompletedByFarmer(Long farmerId);

    @Query("SELECT FUNCTION('MONTH', o.createdAt) as month, COUNT(o) as count FROM Order o GROUP BY FUNCTION('MONTH', o.createdAt) ORDER BY month")
    List<Object[]> monthlyOrderCounts();

    @Query("SELECT FUNCTION('MONTH', o.createdAt) as month, COALESCE(SUM(o.totalAmount),0) as amount FROM Order o WHERE o.buyer.id = :buyerId GROUP BY FUNCTION('MONTH', o.createdAt) ORDER BY month")
    List<Object[]> monthlySpendingByBuyer(Long buyerId);

    @Query("SELECT FUNCTION('MONTH', o.createdAt) as month, COALESCE(SUM(o.totalAmount),0) as amount FROM Order o WHERE o.farmer.id = :farmerId GROUP BY FUNCTION('MONTH', o.createdAt) ORDER BY month")
    List<Object[]> monthlySalesByFarmer(Long farmerId);
}
