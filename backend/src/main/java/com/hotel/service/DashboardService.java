package com.hotel.service;

import com.hotel.dto.dashboard.DashboardStats;
import com.hotel.entity.enums.CheckInStatus;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.repository.CheckInRepository;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final CheckInRepository checkInRepository;

    public DashboardStats getStats() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long maintenanceRooms = roomRepository.countByStatus(RoomStatus.MAINTENANCE);
        long reservedRooms = roomRepository.countByStatus(RoomStatus.RESERVED);
        long pendingReservations = reservationRepository.findByStatus(ReservationStatus.PENDING).size();
        long todayCheckIns = checkInRepository.findAll().stream()
                .filter(ci -> ci.getActualCheckIn() != null
                        && ci.getActualCheckIn().toLocalDate().equals(LocalDate.now()))
                .count();
        long todayCheckOuts = checkInRepository.findAll().stream()
                .filter(ci -> ci.getActualCheckOut() != null
                        && ci.getActualCheckOut().toLocalDate().equals(LocalDate.now()))
                .count();
        return new DashboardStats(availableRooms, occupiedRooms, maintenanceRooms, reservedRooms,
                totalRooms, todayCheckIns, todayCheckOuts, pendingReservations);
    }
}