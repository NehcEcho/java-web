package com.hotel.service;

import com.hotel.dto.favorite.FavoriteResponse;
import com.hotel.entity.Favorite;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.User;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.FavoriteRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private ReviewService reviewService;

    @InjectMocks
    private FavoriteService favoriteService;

    private User createUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setRole(UserRole.CUSTOMER);
        return user;
    }

    private Room createRoom() {
        RoomType roomType = new RoomType();
        roomType.setId(1L);
        roomType.setName("标准间");
        roomType.setBasePrice(new BigDecimal("200.00"));
        roomType.setMaxGuests(2);

        Room room = new Room();
        room.setId(1L);
        room.setRoomNumber("101");
        room.setFloor(1);
        room.setStatus(RoomStatus.AVAILABLE);
        room.setRoomType(roomType);
        return room;
    }

    @Test
    void addFavorite_shouldCreateFavorite() {
        User user = createUser();
        Room room = createRoom();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(favoriteRepository.existsByUserIdAndRoomId(1L, 1L)).thenReturn(false);
        when(userRepository.getReferenceById(1L)).thenReturn(user);
        when(favoriteRepository.save(any())).thenAnswer(inv -> {
            Favorite f = inv.getArgument(0);
            f.setId(1L);
            return f;
        });
        when(reviewService.getAvgRating(1L)).thenReturn(0.0);

        FavoriteResponse response = favoriteService.addFavorite(1L, 1L);

        assertNotNull(response);
        assertEquals(1L, response.getRoomId());
        verify(favoriteRepository).save(any());
    }

    @Test
    void addFavorite_shouldThrowWhenDuplicate() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(createUser()));
        Room room = createRoom();
        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(favoriteRepository.existsByUserIdAndRoomId(1L, 1L)).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class,
                () -> favoriteService.addFavorite(1L, 1L));
        assertEquals("已收藏该房间", ex.getMessage());
        verify(favoriteRepository, never()).save(any());
    }

    @Test
    void removeFavorite_shouldDeleteFavorite() {
        favoriteService.removeFavorite(1L, 1L);

        verify(favoriteRepository).deleteByUserIdAndRoomId(1L, 1L);
    }

    @Test
    void removeFavorite_shouldNotThrowForNonExistent() {
        assertDoesNotThrow(() -> favoriteService.removeFavorite(999L, 999L));
        verify(favoriteRepository).deleteByUserIdAndRoomId(999L, 999L);
    }

    @Test
    void getFavorites_shouldReturnUserFavorites() {
        User user = createUser();
        Room room = createRoom();

        Favorite favorite = new Favorite();
        favorite.setId(1L);
        favorite.setUser(user);
        favorite.setRoom(room);

        when(favoriteRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(favorite));
        when(reviewService.getAvgRating(1L)).thenReturn(4.5);

        List<FavoriteResponse> favorites = favoriteService.getUserFavorites(1L);

        assertNotNull(favorites);
        assertEquals(1, favorites.size());
        assertEquals(1L, favorites.get(0).getRoomId());
    }
}
