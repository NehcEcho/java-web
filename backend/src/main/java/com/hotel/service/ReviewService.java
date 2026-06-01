package com.hotel.service;

import com.hotel.dto.review.ReviewRequest;
import com.hotel.dto.review.ReviewResponse;
import com.hotel.entity.Review;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import com.hotel.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final NotificationService notificationService;

    public ReviewResponse createReview(Long roomId, Long userId, ReviewRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException("房间不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        boolean hasCompletedReservation = reservationRepository.findByUserId(userId).stream()
                .anyMatch(r -> r.getRoom().getId().equals(roomId)
                        && r.getStatus() == ReservationStatus.COMPLETED);
        if (!hasCompletedReservation) {
            throw new BusinessException("只能评价已完成的订单");
        }

        if (reviewRepository.existsByUserIdAndRoomId(userId, roomId)) {
            throw new BusinessException("你已经评价过该房间");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setUser(user);
        review.setRoom(room);
        review.setVisible(true);
        review = reviewRepository.save(review);

        notificationService.createNotificationForRole(
                UserRole.ADMIN,
                "新评价",
                user.getUsername() + " 对房间 " + room.getRoomNumber() + " 发表了评价（" + request.getRating() + "星）",
                "REVIEW"
        );

        return toResponse(review);
    }

    public List<ReviewResponse> getRoomReviews(Long roomId) {
        return reviewRepository.findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(roomId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ReviewResponse toggleVisibility(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException("评价不存在"));
        review.setVisible(!review.getVisible());
        return toResponse(reviewRepository.save(review));
    }

    public double getAvgRating(Long roomId) {
        List<Review> reviews = reviewRepository.findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(roomId);
        if (reviews.isEmpty()) {
            return 0;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0);
    }

    public int getReviewCount(Long roomId) {
        return reviewRepository.countByRoomIdAndVisibleTrue(roomId);
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setContent(review.getContent());
        response.setUsername(review.getUser().getUsername());
        response.setRoomId(review.getRoom().getId());
        response.setVisible(review.getVisible());
        response.setCreatedAt(review.getCreatedAt());
        return response;
    }
}