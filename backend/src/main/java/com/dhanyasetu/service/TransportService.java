package com.dhanyasetu.service;

import com.dhanyasetu.dto.TransportAssignmentDto;
import com.dhanyasetu.model.Order;
import com.dhanyasetu.model.OrderStatusHistory;
import com.dhanyasetu.model.TransportAssignment;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.OrderRepository;
import com.dhanyasetu.repository.TransportAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransportService {

    private final TransportAssignmentRepository transportRepo;
    private final OrderRepository orderRepo;
    private final NotificationService notificationService;

    public List<TransportAssignmentDto> getAssignments(Long transporterId) {
        return transportRepo.findByTransporterIdOrderByAssignedAtDesc(transporterId)
            .stream().map(TransportAssignmentDto::from).collect(Collectors.toList());
    }

    @Transactional
    public TransportAssignmentDto updateStatus(Long assignmentId, String newStatus, User transporter) {
        TransportAssignment ta = transportRepo.findById(assignmentId)
            .orElseThrow(() -> new IllegalArgumentException("Assignment not found."));
        if (!ta.getTransporter().getId().equals(transporter.getId())) {
            throw new SecurityException("Not authorized.");
        }
        TransportAssignment.Status status = TransportAssignment.Status.valueOf(newStatus);
        validateTransition(ta.getStatus(), status);
        ta.setStatus(status);

        Order order = ta.getOrder();
        if (status == TransportAssignment.Status.PICKED_UP) {
            ta.setPickedUpAt(LocalDateTime.now());
            order.setStatus(Order.Status.PICKED_UP);
        } else if (status == TransportAssignment.Status.IN_TRANSIT) {
            order.setStatus(Order.Status.IN_TRANSIT);
        } else if (status == TransportAssignment.Status.DELIVERED) {
            ta.setDeliveredAt(LocalDateTime.now());
            order.setStatus(Order.Status.DELIVERED);
            notificationService.send(order.getBuyer(), "Order Delivered",
                "Your order " + order.getOrderRef() + " has been delivered.",
                "ORDER_DELIVERED", order.getId());
        }
        order.getStatusHistory().add(OrderStatusHistory.builder()
            .order(order).status(order.getStatus()).build());
        orderRepo.save(order);
        return TransportAssignmentDto.from(transportRepo.save(ta));
    }

    private void validateTransition(TransportAssignment.Status cur, TransportAssignment.Status next) {
        boolean valid = (cur == TransportAssignment.Status.ASSIGNED && next == TransportAssignment.Status.PICKED_UP)
            || (cur == TransportAssignment.Status.PICKED_UP && next == TransportAssignment.Status.IN_TRANSIT)
            || (cur == TransportAssignment.Status.IN_TRANSIT && next == TransportAssignment.Status.DELIVERED);
        if (!valid) throw new IllegalArgumentException("Invalid status transition: " + cur + " -> " + next);
    }
}
