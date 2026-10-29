package com.dhanyasetu.service;

import com.dhanyasetu.model.Notification;
import com.dhanyasetu.model.User;
import com.dhanyasetu.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void send(User user, String title, String message, String type, Long referenceId) {
        notificationRepository.save(Notification.builder()
            .user(user)
            .title(title)
            .message(message)
            .type(type)
            .referenceId(referenceId)
            .build());
    }

    public List<Notification> getForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public void markRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            if (n.getUser().getId().equals(userId)) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
    }
}
