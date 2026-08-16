package com.pustakalaya.backend.controller;

import com.pustakalaya.backend.entity.Notification;
import com.pustakalaya.backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5176"
    },
    allowCredentials = "true"
)
public class NotificationController {

    private final NotificationService
            notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>>
    getUserNotifications(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUserNotifications(
                                userId
                        )
        );
    }

    @GetMapping(
        "/user/{userId}/unread-count"
    )
    public ResponseEntity<Long>
    getUnreadCount(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                notificationService
                        .getUnreadCount(
                                userId
                        )
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification>
    markAsRead(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                notificationService
                        .markAsRead(id)
        );
    }
}