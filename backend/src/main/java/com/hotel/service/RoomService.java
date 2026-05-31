package com.hotel.service;

import com.hotel.dto.room.DateAvailability;
import com.hotel.dto.room.RoomRequest;
import com.hotel.dto.room.RoomResponse;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final ReviewService reviewService;
    private final ReservationRepository reservationRepository;

    public List<RoomResponse> findAll() {
        return roomRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<RoomResponse> findByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<RoomResponse> findAvailableRooms(LocalDate checkIn, LocalDate checkOut, Integer floor, String sortBy, String sortDir) {
        List<Room> rooms = roomRepository.findAvailableRooms(checkIn, checkOut);

        if (floor != null) {
            rooms = rooms.stream()
                    .filter(r -> r.getFloor().equals(floor))
                    .collect(Collectors.toList());
        }

        Comparator<Room> comparator;
        if ("floor".equalsIgnoreCase(sortBy)) {
            comparator = Comparator.comparing(Room::getFloor);
        } else {
            comparator = Comparator.comparing(r -> r.getRoomType().getBasePrice());
        }

        if ("desc".equalsIgnoreCase(sortDir)) {
            comparator = comparator.reversed();
        }

        rooms = rooms.stream().sorted(comparator).collect(Collectors.toList());

        return rooms.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RoomResponse findById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        return toResponse(room);
    }

    public RoomResponse create(RoomRequest request) {
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setStatus(RoomStatus.AVAILABLE);
        room.setRoomType(roomType);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse update(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setRoomType(roomType);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse updateStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        room.setStatus(status);
        return toResponse(roomRepository.save(room));
    }

    public List<DateAvailability> getRoomAvailability(Long roomId, LocalDate month) {
        roomRepository.findById(roomId).orElseThrow(() -> new BusinessException("房间不存在"));
        LocalDate monthStart = month.withDayOfMonth(1);
        LocalDate monthEnd = month.withDayOfMonth(month.lengthOfMonth());
        List<Reservation> bookings = reservationRepository.findBookedDatesInRange(roomId, monthStart, monthEnd);
        Set<LocalDate> bookedDates = new HashSet<>();
        for (Reservation r : bookings) {
            LocalDate start = r.getCheckInDate().isBefore(monthStart) ? monthStart : r.getCheckInDate();
            LocalDate end = r.getCheckOutDate().isAfter(monthEnd) ? monthEnd : r.getCheckOutDate();
            for (LocalDate d = start; d.isBefore(end); d = d.plusDays(1)) {
                bookedDates.add(d);
            }
        }
        List<DateAvailability> result = new ArrayList<>();
        for (LocalDate d = monthStart; !d.isAfter(monthEnd); d = d.plusDays(1)) {
            result.add(new DateAvailability(d.toString(), !bookedDates.contains(d)));
        }
        return result;
    }

    private RoomResponse toResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setFloor(room.getFloor());
        response.setStatus(room.getStatus().name());
        RoomType rt = room.getRoomType();
        RoomTypeResponse rtResponse = new RoomTypeResponse();
        rtResponse.setId(rt.getId());
        rtResponse.setName(rt.getName());
        rtResponse.setBasePrice(rt.getBasePrice());
        rtResponse.setMaxGuests(rt.getMaxGuests());
        rtResponse.setDescription(rt.getDescription());
        rtResponse.setAmenities(rt.getAmenities());
        response.setRoomType(rtResponse);
        response.setAvgRating(reviewService.getAvgRating(room.getId()));
        response.setReviewCount(reviewService.getReviewCount(room.getId()));
        response.setIsFavorited(false);
        return response;
    }
}