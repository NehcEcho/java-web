package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.notification.NotificationResponse;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @GetMapping
    public ApiResponse<List<NotificationResponse>> getNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/unread")
    public ApiResponse<List<NotificationResponse>> getUnreadNotifications(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(notificationService.getUnreadNotifications(userId));
    }

    @GetMapping("/count")
    public ApiResponse<Long> getUnreadCount(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(notificationService.getUnreadCount(userId));
    }

    @PatchMapping("/{id}/read")
    public ApiResponse<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ApiResponse.success(null);
    }

    @PatchMapping("/read-all")
    public ApiResponse<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        notificationService.markAllAsRead(userId);
        return ApiResponse.success(null);
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BusinessException("用户不存在")).getId();
    }
}
