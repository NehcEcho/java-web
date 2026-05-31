package com.hotel.repository;

import com.hotel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(Long roomId);
    List<Review> findAllByOrderByCreatedAtDesc();
    Optional<Review> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    int countByRoomIdAndVisibleTrue(Long roomId);
}