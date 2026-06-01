package com.hotel.service;

import com.hotel.dto.favorite.FavoriteResponse;
import com.hotel.entity.Favorite;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.exception.BusinessException;
import com.hotel.repository.FavoriteRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReviewService reviewService;

    @Transactional
    public FavoriteResponse addFavorite(Long userId, Long roomId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new BusinessException("房间不存在"));

        if (favoriteRepository.existsByUserIdAndRoomId(userId, roomId)) {
            throw new BusinessException("已收藏该房间");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(userRepository.getReferenceById(userId));
        favorite.setRoom(room);
        return toResponse(favoriteRepository.save(favorite));
    }

    @Transactional
    public void removeFavorite(Long userId, Long roomId) {
        favoriteRepository.deleteByUserIdAndRoomId(userId, roomId);
    }

    public List<FavoriteResponse> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public boolean isFavorited(Long userId, Long roomId) {
        return favoriteRepository.existsByUserIdAndRoomId(userId, roomId);
    }

    private FavoriteResponse toResponse(Favorite f) {
        FavoriteResponse response = new FavoriteResponse();
        response.setId(f.getId());
        response.setRoomId(f.getRoom().getId());
        response.setRoomNumber(f.getRoom().getRoomNumber());
        response.setRoomTypeName(f.getRoom().getRoomType().getName());
        response.setBasePrice(f.getRoom().getRoomType().getBasePrice().doubleValue());
        response.setMaxGuests(f.getRoom().getRoomType().getMaxGuests());
        response.setFloor(String.valueOf(f.getRoom().getFloor()));
        response.setStatus(f.getRoom().getStatus().name());
        response.setAvgRating(reviewService.getAvgRating(f.getRoom().getId()));
        response.setCreatedAt(f.getCreatedAt());
        return response;
    }
}