package com.hotel.service;

import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ReservationService reservationService;

    private User createUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("encoded");
        user.setRole(UserRole.CUSTOMER);
        user.setName("Test User");
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

    private Reservation createReservation() {
        Reservation reservation = new Reservation();
        reservation.setId(1L);
        reservation.setCheckInDate(LocalDate.now().plusDays(1));
        reservation.setCheckOutDate(LocalDate.now().plusDays(3));
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setTotalPrice(new BigDecimal("400.00"));
        reservation.setGuestCount(2);
        reservation.setUser(createUser());
        reservation.setRoom(createRoom());
        return reservation;
    }

    private ReservationRequest createRequest() {
        ReservationRequest request = new ReservationRequest();
        request.setRoomId(1L);
        request.setCheckInDate(LocalDate.now().plusDays(1));
        request.setCheckOutDate(LocalDate.now().plusDays(3));
        request.setGuestCount(2);
        return request;
    }

    @Test
    void create_shouldSucceedWithValidDates() {
        ReservationRequest request = createRequest();
        User user = createUser();
        Room room = createRoom();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reservationRepository.findConflictingReservations(anyLong(), any(), any()))
                .thenReturn(Collections.emptyList());
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            r.setId(1L);
            return r;
        });

        ReservationResponse response = reservationService.create(request, 1L);

        assertNotNull(response);
        assertEquals("PENDING", response.getStatus());
        verify(reservationRepository).save(any());
    }

    @Test
    void create_shouldThrowWhenCheckoutBeforeCheckin() {
        ReservationRequest request = createRequest();
        request.setCheckInDate(LocalDate.now().plusDays(3));
        request.setCheckOutDate(LocalDate.now().plusDays(1));
        User user = createUser();
        Room room = createRoom();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reservationService.create(request, 1L));
        assertEquals("退房日期必须晚于入住日期", ex.getMessage());
    }

    @Test
    void create_shouldThrowWhenRoomNotFound() {
        ReservationRequest request = createRequest();
        when(roomRepository.findById(1L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reservationService.create(request, 1L));
        assertEquals("房间不存在", ex.getMessage());
    }

    @Test
    void create_shouldThrowWhenDateConflict() {
        ReservationRequest request = createRequest();
        User user = createUser();
        Room room = createRoom();

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(reservationRepository.findConflictingReservations(anyLong(), any(), any()))
                .thenReturn(Collections.singletonList(createReservation()));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reservationService.create(request, 1L));
        assertEquals("该房间在此日期已被预订", ex.getMessage());
    }

    @Test
    void confirm_shouldChangeStatusToConfirmedAndRoomToReserved() {
        Reservation reservation = createReservation();
        reservation.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.findConflictingReservations(anyLong(), any(), any()))
                .thenReturn(Collections.singletonList(reservation));
        when(roomRepository.save(any())).thenReturn(reservation.getRoom());
        when(reservationRepository.save(any())).thenReturn(reservation);

        ReservationResponse response = reservationService.confirm(1L);

        assertEquals("CONFIRMED", response.getStatus());
        assertEquals(RoomStatus.RESERVED, reservation.getRoom().getStatus());
        verify(roomRepository).save(reservation.getRoom());
    }

    @Test
    void confirm_shouldThrowWhenAlreadyConfirmed() {
        Reservation reservation = createReservation();
        reservation.setStatus(ReservationStatus.CONFIRMED);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reservationService.confirm(1L));
        assertEquals("只有待确认的预订才能确认", ex.getMessage());
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void confirm_shouldThrowWhenDateConflictWithOtherReservation() {
        Reservation reservation = createReservation();
        reservation.setStatus(ReservationStatus.PENDING);

        Reservation otherReservation = createReservation();
        otherReservation.setId(2L);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.findConflictingReservations(anyLong(), any(), any()))
                .thenReturn(java.util.Arrays.asList(reservation, otherReservation));

        BusinessException ex = assertThrows(BusinessException.class,
                () -> reservationService.confirm(1L));
        assertEquals("该房间在此日期已被预订", ex.getMessage());
    }

    @Test
    void cancel_shouldSetStatusCancelled() {
        Reservation reservation = createReservation();
        reservation.setStatus(ReservationStatus.PENDING);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any())).thenReturn(reservation);

        ReservationResponse response = reservationService.cancel(1L);

        assertEquals("CANCELLED", response.getStatus());
    }

    @Test
    void cancel_shouldSetRoomToAvailableWhenConfirmed() {
        Reservation reservation = createReservation();
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.getRoom().setStatus(RoomStatus.RESERVED);

        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(roomRepository.save(any())).thenReturn(reservation.getRoom());
        when(reservationRepository.save(any())).thenReturn(reservation);

        ReservationResponse response = reservationService.cancel(1L);

        assertEquals("CANCELLED", response.getStatus());
        assertEquals(RoomStatus.AVAILABLE, reservation.getRoom().getStatus());
        verify(roomRepository).save(reservation.getRoom());
    }
}
