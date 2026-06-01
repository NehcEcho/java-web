package com.hotel.service;

import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ReservationResponse create(ReservationRequest request, Long userId) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new BusinessException("房间不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        if (request.getGuestCount() != null && request.getGuestCount() < 1) {
            throw new BusinessException("入住人数必须大于0");
        }
        if (request.getGuestCount() != null && request.getGuestCount() > room.getRoomType().getMaxGuests()) {
            throw new BusinessException("入住人数超过该房型最大入住人数(" + room.getRoomType().getMaxGuests() + ")");
        }

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new BusinessException("退房日期必须晚于入住日期");
        }
        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new BusinessException("入住日期不能早于今天");
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
        reservation = reservationRepository.save(reservation);

        notificationService.createNotification(
                user.getId(),
                "预订已提交",
                "您的预订 #" + reservation.getId() + " 已提交，等待确认",
                "RESERVATION"
        );
        notificationService.createNotificationForRole(
                UserRole.ADMIN,
                "新预订待确认",
                user.getName() + " 预订了房间 " + room.getRoomNumber() + "（#" + reservation.getId() + "），请及时处理",
                "RESERVATION"
        );

        return toResponse(reservation);
    }

    @Transactional
    public List<ReservationResponse> createBatch(List<ReservationRequest> requests, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        List<ReservationResponse> results = new java.util.ArrayList<>();
        for (ReservationRequest request : requests) {
            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new BusinessException("房间不存在: " + request.getRoomId()));

            long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
            if (nights <= 0) {
                throw new BusinessException("退房日期必须晚于入住日期");
            }
            BigDecimal totalPrice = room.getRoomType().getBasePrice().multiply(BigDecimal.valueOf(nights));

            List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                    room.getId(), request.getCheckInDate(), request.getCheckOutDate());
            if (!conflicts.isEmpty()) {
                throw new BusinessException("房间 " + room.getRoomNumber() + " 在此日期已被预订");
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
            results.add(toResponse(reservationRepository.save(reservation)));
        }
        return results;
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

    @Transactional
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

        notificationService.createNotification(
                reservation.getUser().getId(),
                "预订已确认",
                "您的预订 #" + reservation.getId() + " 已确认，房间 " + reservation.getRoom().getRoomNumber(),
                "RESERVATION"
        );

        notificationService.createNotificationForRole(
                UserRole.ADMIN,
                "预订已确认",
                "预订 #" + reservation.getId() + "（房间 " + reservation.getRoom().getRoomNumber() + "）已确认",
                "RESERVATION"
        );

        return toResponse(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponse cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new BusinessException("预订已取消");
        }
        if (reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new BusinessException("已完成的预订不能取消");
        }
        if (reservation.getStatus() == ReservationStatus.CONFIRMED && reservation.getRoom().getStatus() == RoomStatus.RESERVED) {
            reservation.getRoom().setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(reservation.getRoom());
        }
        reservation.setStatus(ReservationStatus.CANCELLED);

        notificationService.createNotification(
                reservation.getUser().getId(),
                "预订已取消",
                "您的预订 #" + reservation.getId() + " 已取消",
                "RESERVATION"
        );

        notificationService.createNotificationForRole(
                UserRole.ADMIN,
                "预订已取消",
                "预订 #" + reservation.getId() + "（房间 " + reservation.getRoom().getRoomNumber() + "）已被取消",
                "RESERVATION"
        );

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
        response.setRoomId(r.getRoom().getId());
        response.setRoomNumber(r.getRoom().getRoomNumber());
        response.setRoomType(r.getRoom().getRoomType().getName());
        response.setUserId(r.getUser().getId());
        response.setUserName(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
        response.setCreatedAt(r.getCreatedAt());
        return response;
    }
}