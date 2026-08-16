package com.pustakalaya.backend.service;

import com.pustakalaya.backend.entity.Notification;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository
            notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    // =====================================================
    // CREATE
    // =====================================================

    public Notification createNotification(
            User user,
            String title,
            String message) {

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);

        return notificationRepository.save(
                notification
        );
    }

    // =====================================================
    // GET USER NOTIFICATIONS
    // =====================================================

    public List<Notification>
    getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }

    // =====================================================
    // UNREAD COUNT
    // =====================================================

    public long getUnreadCount(
            Long userId) {

        return notificationRepository
                .countByUserIdAndReadFalse(
                        userId
                );
    }

    // =====================================================
    // MARK READ
    // =====================================================

    public Notification markAsRead(
            Long id) {

        Notification notification =
                notificationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Notification not found."
                                )
                        );

        notification.setRead(true);

        return notificationRepository.save(
                notification
        );
    }
}