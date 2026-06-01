package com.hotel.repository;

import com.hotel.entity.Reservation;
import com.hotel.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
    List<Reservation> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status <> 'CANCELLED' AND r.checkInDate < :checkOut AND r.checkOutDate > :checkIn")
    List<Reservation> findConflictingReservations(@Param("roomId") Long roomId, @Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    @Query("SELECT r FROM Reservation r WHERE r.room.id = :roomId AND r.status <> 'CANCELLED' AND r.checkInDate < :monthEnd AND r.checkOutDate > :monthStart")
    List<Reservation> findBookedDatesInRange(@Param("roomId") Long roomId, @Param("monthStart") LocalDate monthStart, @Param("monthEnd") LocalDate monthEnd);

    @Query("SELECT r FROM Reservation r WHERE r.status IN ('CONFIRMED', 'COMPLETED') AND r.createdAt >= :startDate AND r.createdAt < :endDate")
    List<Reservation> findCompletedReservationsInRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT r.user.id, COUNT(r) FROM Reservation r WHERE r.status IN ('CONFIRMED', 'COMPLETED') GROUP BY r.user.id HAVING COUNT(r) > 1")
    List<Object[]> findReturningCustomers();

    @Query("SELECT r.user.id, SUM(r.totalPrice), COUNT(r) FROM Reservation r WHERE r.status IN ('CONFIRMED', 'COMPLETED') GROUP BY r.user.id")
    List<Object[]> findCustomerSpending();

    @Query("SELECT r.user.id, COUNT(r), SUM(r.totalPrice) FROM Reservation r WHERE r.status IN ('CONFIRMED', 'COMPLETED') GROUP BY r.user.id ORDER BY SUM(r.totalPrice) DESC")
    List<Object[]> findTopCustomers();
}