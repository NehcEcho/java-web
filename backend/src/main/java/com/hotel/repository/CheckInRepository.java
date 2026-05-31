package com.hotel.repository;

import com.hotel.entity.CheckIn;
import com.hotel.entity.enums.CheckInStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByStatus(CheckInStatus status);
    List<CheckIn> findByReservationId(Long reservationId);
}