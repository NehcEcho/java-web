package com.hotel.repository;

import com.hotel.entity.CheckIn;
import com.hotel.entity.enums.CheckInStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByStatus(CheckInStatus status);
    List<CheckIn> findByReservationId(Long reservationId);
    List<CheckIn> findByActualCheckInBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT c FROM CheckIn c WHERE c.actualCheckIn IS NOT NULL AND c.actualCheckIn >= :start AND c.actualCheckIn < :end")
    List<CheckIn> findTodayCheckIns(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT c FROM CheckIn c WHERE c.actualCheckOut IS NOT NULL AND c.actualCheckOut >= :start AND c.actualCheckOut < :end")
    List<CheckIn> findTodayCheckOuts(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}