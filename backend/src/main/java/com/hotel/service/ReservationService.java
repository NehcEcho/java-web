package com.hotel.service;

import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReservationResponse create(ReservationRequest request, Long userId) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new BusinessException("房间不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new BusinessException("退房日期必须晚于入住日期");
        }
        BigDecimal totalPrice = room.getRoomType().getBasePrice().multiply(BigDecimal.valueOf(nights));

        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                room.getId(), request.getCheckInDate(), request.getCheckOutDate());
        if (!conflicts.isEmpty()) {
            throw new BusinessException("该房间在此日期已被预订");
        }

        Reservation reservation = new Reservation();
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setTotalPrice(totalPrice);
        reservation.setGuestCount(request.getGuestCount());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setUser(user);
        reservation.setRoom(room);
        return toResponse(reservationRepository.save(reservation));
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReservationResponse> findByUserId(Long userId) {
        return reservationRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReservationResponse findById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        return toResponse(reservation);
    }

    public ReservationResponse confirm(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new BusinessException("只有待确认的预订才能确认");
        }
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                reservation.getRoom().getId(), reservation.getCheckInDate(), reservation.getCheckOutDate());
        List<Reservation> otherConflicts = conflicts.stream()
                .filter(r -> !r.getId().equals(reservation.getId()))
                .toList();
        if (!otherConflicts.isEmpty()) {
            throw new BusinessException("该房间在此日期已被预订");
        }
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.getRoom().setStatus(RoomStatus.RESERVED);
        roomRepository.save(reservation.getRoom());
        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationResponse cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() == ReservationStatus.CONFIRMED && reservation.getRoom().getStatus() == RoomStatus.RESERVED) {
            reservation.getRoom().setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(reservation.getRoom());
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        return toResponse(reservationRepository.save(reservation));
    }

    private ReservationResponse toResponse(Reservation r) {
        ReservationResponse response = new ReservationResponse();
        response.setId(r.getId());
        response.setCheckInDate(r.getCheckInDate());
        response.setCheckOutDate(r.getCheckOutDate());
        response.setStatus(r.getStatus().name());
        response.setTotalPrice(r.getTotalPrice());
        response.setGuestCount(r.getGuestCount());
        response.setSpecialRequests(r.getSpecialRequests());
        response.setRoomNumber(r.getRoom().getRoomNumber());
        response.setRoomType(r.getRoom().getRoomType().getName());
        response.setUserId(r.getUser().getId());
        response.setUserName(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
        response.setCreatedAt(r.getCreatedAt());
        return response;
    }
}