package com.hotel.repository;

import com.hotel.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favorite> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);

    @Modifying
    void deleteByUserIdAndRoomId(Long userId, Long roomId);
}