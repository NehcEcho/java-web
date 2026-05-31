package com.hotel.service;

import com.hotel.dto.checkin.CheckInRequest;
import com.hotel.dto.checkin.CheckInResponse;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.CheckIn;
import com.hotel.entity.Reservation;
import com.hotel.entity.enums.CheckInStatus;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.CheckInRepository;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public CheckInResponse checkIn(CheckInRequest request) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new BusinessException("只有已确认的预订才能办理入住");
        }
        List<CheckIn> existingCheckIns = checkInRepository.findByReservationId(reservation.getId());
        boolean alreadyCheckedIn = existingCheckIns.stream()
                .anyMatch(ci -> ci.getStatus() == CheckInStatus.STAYING);
        if (alreadyCheckedIn) {
            throw new BusinessException("该预订已办理入住");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        CheckIn checkIn = new CheckIn();
        checkIn.setActualCheckIn(LocalDateTime.now());
        checkIn.setStatus(CheckInStatus.STAYING);
        checkIn.setDeposit(request.getDeposit());
        checkIn.setNotes(request.getNotes());
        checkIn.setReservation(reservation);

        reservation.getRoom().setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(reservation.getRoom());

        return toResponse(checkInRepository.save(checkIn));
    }

    public CheckInResponse checkOut(Long id) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new BusinessException("入住记录不存在"));
        if (checkIn.getStatus() != CheckInStatus.STAYING) {
            throw new BusinessException("该房间未在住状态");
        }
        checkIn.setActualCheckOut(LocalDateTime.now());
        checkIn.setStatus(CheckInStatus.CHECKED_OUT);
        checkIn.getReservation().getRoom().setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(checkIn.getReservation().getRoom());
        return toResponse(checkInRepository.save(checkIn));
    }

    public List<CheckInResponse> findAll() {
        return checkInRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private CheckInResponse toResponse(CheckIn ci) {
        CheckInResponse response = new CheckInResponse();
        response.setId(ci.getId());
        response.setActualCheckIn(ci.getActualCheckIn());
        response.setActualCheckOut(ci.getActualCheckOut());
        response.setStatus(ci.getStatus().name());
        response.setDeposit(ci.getDeposit());
        response.setNotes(ci.getNotes());

        Reservation r = ci.getReservation();
        ReservationResponse resResponse = new ReservationResponse();
        resResponse.setId(r.getId());
        resResponse.setCheckInDate(r.getCheckInDate());
        resResponse.setCheckOutDate(r.getCheckOutDate());
        resResponse.setStatus(r.getStatus().name());
        resResponse.setTotalPrice(r.getTotalPrice());
        resResponse.setGuestCount(r.getGuestCount());
        resResponse.setSpecialRequests(r.getSpecialRequests());
        resResponse.setRoomNumber(r.getRoom().getRoomNumber());
        resResponse.setRoomType(r.getRoom().getRoomType().getName());
        resResponse.setUserId(r.getUser().getId());
        resResponse.setUserName(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
        resResponse.setCreatedAt(r.getCreatedAt());
        response.setReservation(resResponse);

        return response;
    }
}