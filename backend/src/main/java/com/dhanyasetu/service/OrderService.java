package com.dhanyasetu.service;

import com.dhanyasetu.dto.OrderDto;
import com.dhanyasetu.dto.OrderRequest;
import com.dhanyasetu.model.*;
import com.dhanyasetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepo;
    private final CropListingRepository cropRepo;
    private final UserRepository userRepo;
    private final TransportAssignmentRepository transportRepo;
    private final NotificationService notificationService;

    @Transactional
    public OrderDto create(OrderRequest req, User buyer) {
        CropListing crop = cropRepo.findById(req.getCropListingId())
            .orElseThrow(() -> new IllegalArgumentException("Crop listing not found."));
        if (crop.getStatus() != CropListing.Status.AVAILABLE) {
            throw new IllegalArgumentException("Crop is not available.");
        }
        if (crop.getQuantity().compareTo(req.getQuantity()) < 0) {
            throw new IllegalArgumentException("Insufficient quantity available.");
        }
        BigDecimal total = crop.getPricePerUnit().multiply(req.getQuantity());
        Order order = Order.builder()
            .buyer(buyer)
            .farmer(crop.getFarmer())
            .cropListing(crop)
            .quantity(req.getQuantity())
            .unit(crop.getUnit())
            .unitPrice(crop.getPricePerUnit())
            .totalAmount(total)
            .deliveryAddress(req.getDeliveryAddress())
            .build();
        order.getStatusHistory().add(OrderStatusHistory.builder()
            .order(order).status(Order.Status.PENDING).note("Order placed").build());
        orderRepo.save(order);

        notificationService.send(crop.getFarmer(),
            "New Order Received",
            "You have a new order for " + crop.getCropName() + " from " + buyer.getFullName(),
            "ORDER_PLACED", order.getId());
        return OrderDto.from(order);
    }

    public Page<OrderDto> getForBuyer(Long buyerId, int page, int size) {
        return orderRepo.findByBuyerIdOrderByCreatedAtDesc(buyerId, PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(o -> enrichWithTransport(OrderDto.from(o), o.getId()));
    }

    public Page<OrderDto> getForFarmer(Long farmerId, int page, int size) {
        return orderRepo.findByFarmerIdOrderByCreatedAtDesc(farmerId, PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(o -> enrichWithTransport(OrderDto.from(o), o.getId()));
    }

    public Page<OrderDto> getAll(int page, int size) {
        return orderRepo.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()))
            .map(o -> enrichWithTransport(OrderDto.from(o), o.getId()));
    }

    @Transactional
    public OrderDto updateStatus(Long orderId, String newStatus, User actor) {
        Order order = orderRepo.findById(orderId)
            .orElseThrow(() -> new IllegalArgumentException("Order not found."));
        Order.Status status = Order.Status.valueOf(newStatus);
        validateTransition(order, status, actor);

        order.setStatus(status);
        order.getStatusHistory().add(OrderStatusHistory.builder()
            .order(order).status(status).build());

        if (status == Order.Status.ACCEPTED) {
            CropListing crop = order.getCropListing();
            crop.setQuantity(crop.getQuantity().subtract(order.getQuantity()));
            if (crop.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
                crop.setStatus(CropListing.Status.SOLD_OUT);
            }
            cropRepo.save(crop);
            // Auto-assign a transporter if available
            autoAssignTransporter(order);
            notificationService.send(order.getBuyer(), "Order Accepted",
                "Your order for " + order.getCropListing().getCropName() + " has been accepted.",
                "ORDER_ACCEPTED", order.getId());
        } else if (status == Order.Status.REJECTED) {
            notificationService.send(order.getBuyer(), "Order Rejected",
                "Your order for " + order.getCropListing().getCropName() + " was rejected.",
                "ORDER_REJECTED", order.getId());
        } else if (status == Order.Status.COMPLETED) {
            order.setPaymentStatus(Order.PaymentStatus.PAID);
        }
        return OrderDto.from(orderRepo.save(order));
    }

    private void validateTransition(Order order, Order.Status newStatus, User actor) {
        Order.Status cur = order.getStatus();
        boolean valid = switch (actor.getRole()) {
            case FARMER -> (cur == Order.Status.PENDING && (newStatus == Order.Status.ACCEPTED || newStatus == Order.Status.REJECTED))
                && order.getFarmer().getId().equals(actor.getId());
            case BUYER  -> cur == Order.Status.PENDING && newStatus == Order.Status.CANCELLED
                && order.getBuyer().getId().equals(actor.getId());
            case ADMIN  -> true;
            default     -> false;
        };
        if (!valid) throw new IllegalArgumentException("Invalid status transition.");
    }

    private void autoAssignTransporter(Order order) {
        userRepo.findAll().stream()
            .filter(u -> u.getRole() == User.Role.TRANSPORTER && u.isEnabled())
            .findFirst()
            .ifPresent(transporter -> {
                if (!transportRepo.existsByOrderId(order.getId())) {
                    String pickup = order.getCropListing().getVillageOrCity() + ", "
                        + order.getCropListing().getDistrict() + ", " + order.getCropListing().getState();
                    TransportAssignment ta = TransportAssignment.builder()
                        .order(order)
                        .transporter(transporter)
                        .pickupAddress(pickup)
                        .deliveryAddress(order.getDeliveryAddress())
                        .build();
                    transportRepo.save(ta);
                    order.setStatus(Order.Status.TRANSPORT_ASSIGNED);
                    order.getStatusHistory().add(OrderStatusHistory.builder()
                        .order(order).status(Order.Status.TRANSPORT_ASSIGNED).note("Auto-assigned").build());
                    notificationService.send(transporter, "New Delivery Assigned",
                        "You have been assigned delivery for order " + order.getOrderRef(),
                        "TRANSPORT_ASSIGNED", order.getId());
                }
            });
    }

    private OrderDto enrichWithTransport(OrderDto dto, Long orderId) {
        transportRepo.findByOrderId(orderId).ifPresent(ta -> dto.setTransportStatus(ta.getStatus().name()));
        return dto;
    }

    public Map<String, Object> getFarmerDashboard(Long farmerId) {
        long total = cropRepo.findByFarmerIdOrderByCreatedAtDesc(farmerId).size();
        long pending = orderRepo.countByFarmerIdAndStatus(farmerId, Order.Status.PENDING);
        long accepted = orderRepo.countByFarmerIdAndStatus(farmerId, Order.Status.ACCEPTED);
        long completed = orderRepo.countByFarmerIdAndStatus(farmerId, Order.Status.COMPLETED);
        List<Map<String, Object>> monthly = orderRepo.monthlySalesByFarmer(farmerId).stream()
            .map(r -> Map.<String, Object>of("month", monthName((Number) r[0]), "amount", r[1]))
            .collect(Collectors.toList());
        return Map.of("totalListings", total, "pendingOrders", pending,
            "acceptedOrders", accepted, "completedOrders", completed, "monthlySales", monthly);
    }

    public Map<String, Object> getBuyerDashboard(Long buyerId) {
        long total = orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.PENDING)
            + orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.ACCEPTED)
            + orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.COMPLETED);
        long pending = orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.PENDING);
        long active = orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.TRANSPORT_ASSIGNED)
            + orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.IN_TRANSIT);
        long completed = orderRepo.countByBuyerIdAndStatus(buyerId, Order.Status.COMPLETED);
        List<Map<String, Object>> monthly = orderRepo.monthlySpendingByBuyer(buyerId).stream()
            .map(r -> Map.<String, Object>of("month", monthName((Number) r[0]), "amount", r[1]))
            .collect(Collectors.toList());
        return Map.of("totalOrders", total, "pendingOrders", pending,
            "activeDeliveries", active, "completedOrders", completed, "monthlySpending", monthly);
    }

    private String monthName(Number m) {
        String[] months = {"Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"};
        int idx = m.intValue() - 1;
        return (idx >= 0 && idx < 12) ? months[idx] : String.valueOf(m);
    }
}
