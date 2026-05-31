package com.hotel.service;

import com.hotel.dto.review.ReviewRequest;
import com.hotel.dto.review.ReviewResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Review;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.ReviewRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private ReviewService reviewService;

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
    void createReview_shouldSucceed() {
        Room room = createRoom();
        User user = createUser();
        ReviewRequest request = new ReviewRequest();
        request.setRating(5);
        request.setContent("非常好的住宿体验");

        Reservation completedReservation = new Reservation();
        completedReservation.setRoom(room);
        completedReservation.setStatus(ReservationStatus.COMPLETED);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reservationRepository.findByUserId(1L)).thenReturn(List.of(completedReservation));
        when(reviewRepository.existsByUserIdAndRoomId(1L, 1L)).thenReturn(false);
        when(reviewRepository.save(any())).thenAnswer(inv -> {
            Review r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        ReviewResponse response = reviewService.createReview(1L, 1L, request);

        assertNotNull(response);
        assertEquals(5, response.getRating());
        assertEquals("非常好的住宿体验", response.getContent());
        verify(reviewRepository).save(any());
    }

    @Test
    void createReview_shouldThrowWhenDuplicate() {
        Room room = createRoom();
        User user = createUser();
        ReviewRequest request = new ReviewRequest();
        request.setRating(4);
        request.setContent("还不错");

        Reservation completedReservation = new Reservation();
        completedReservation.setRoom(room);
        completedReservation.setStatus(ReservationStatus.COMPLETED);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reservationRepository.findByUserId(1L)).thenReturn(List.of(completedReservation));
        when(reviewRepository.existsByUserIdAndRoomId(1L, 1L)).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reviewService.createReview(1L, 1L, request));
        assertEquals("你已经评价过该房间", ex.getMessage());
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void getRoomReviews_shouldReturnList() {
        User user = createUser();
        Room room = createRoom();

        Review review = new Review();
        review.setId(1L);
        review.setRating(4);
        review.setContent("不错");
        review.setUser(user);
        review.setRoom(room);
        review.setVisible(true);

        when(reviewRepository.findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(1L))
                .thenReturn(List.of(review));

        List<ReviewResponse> reviews = reviewService.getRoomReviews(1L);

        assertNotNull(reviews);
        assertEquals(1, reviews.size());
        assertEquals("testuser", reviews.get(0).getUsername());
    }

    @Test
    void toggleVisibility_shouldToggleReviewVisibility() {
        User user = createUser();
        Room room = createRoom();

        Review review = new Review();
        review.setId(1L);
        review.setRating(3);
        review.setContent("一般般");
        review.setUser(user);
        review.setRoom(room);
        review.setVisible(true);

        when(reviewRepository.findById(1L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(any())).thenReturn(review);

        ReviewResponse response = reviewService.toggleVisibility(1L);

        assertFalse(response.getVisible());
    }
}
