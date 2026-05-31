package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.review.ReviewRequest;
import com.hotel.dto.review.ReviewResponse;
import com.hotel.entity.User;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @PostMapping("/rooms/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> create(@PathVariable Long roomId,
                                                                @Valid @RequestBody ReviewRequest request,
                                                                @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(ApiResponse.success(reviewService.createReview(roomId, userId, request)));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRoomReviews(@PathVariable Long roomId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getRoomReviews(roomId)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviews()));
    }

    @PatchMapping("/{id}/visibility")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.toggleVisibility(id)));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BusinessException("用户不存在")).getId();
    }
}