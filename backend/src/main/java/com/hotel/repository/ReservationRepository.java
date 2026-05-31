package com.hotel.repository;

import com.hotel.entity.Reservation;
import com.hotel.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status <> 'CANCELLED' AND r.checkInDate < :checkOut AND r.checkOutDate > :checkIn")
    List<Reservation> findConflictingReservations(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status <> 'CANCELLED' AND r.checkInDate < :monthEnd AND r.checkOutDate > :monthStart")
    List<Reservation> findBookedDatesInRange(@Param("roomId") Long roomId, @Param("monthStart") LocalDate monthStart, @Param("monthEnd") LocalDate monthEnd);
}