package com.hotel.service;

import com.hotel.dto.room.DateAvailability;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private RoomTypeRepository roomTypeRepository;

    @Mock
    private ReviewService reviewService;

    @Mock
    private ReservationRepository reservationRepository;

    @InjectMocks
    private RoomService roomService;

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
    void getRoomAvailability_shouldReturnCorrectDates() {
        Room room = createRoom();
        LocalDate month = LocalDate.of(2026, 6, 1);

        Reservation reservation = new Reservation();
        reservation.setCheckInDate(LocalDate.of(2026, 6, 5));
        reservation.setCheckOutDate(LocalDate.of(2026, 6, 7));
        reservation.setStatus(ReservationStatus.CONFIRMED);

        when(roomRepository.findById(1L)).thenReturn(Optional.of(room));
        when(reservationRepository.findBookedDatesInRange(eq(1L), any(), any()))
                .thenReturn(Collections.singletonList(reservation));

        List<DateAvailability> result = roomService.getRoomAvailability(1L, month);

        assertNotNull(result);
        assertEquals(30, result.size());
        assertEquals("2026-06-01", result.get(0).getDate());
        assertTrue(result.get(0).isAvailable());
        assertEquals("2026-06-05", result.get(4).getDate());
        assertFalse(result.get(4).isAvailable());
        assertFalse(result.get(5).isAvailable());
        assertEquals("2026-06-07", result.get(6).getDate());
        assertTrue(result.get(6).isAvailable());
    }

    @Test
    void findById_shouldThrowForNonExistentRoom() {
        when(roomRepository.findById(999L)).thenReturn(Optional.empty());

        BusinessException ex = assertThrows(BusinessException.class,
                () -> roomService.findById(999L));
        assertEquals("房间不存在", ex.getMessage());
    }
}
