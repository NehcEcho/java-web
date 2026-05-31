package com.hotel.repository;

import com.hotel.entity.Room;
import com.hotel.entity.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);
    List<Room> findByRoomTypeId(Long roomTypeId);

    @Query("SELECT r FROM Room r WHERE r.status = 'AVAILABLE' AND r.id NOT IN " +
           "(SELECT res.room.id FROM Reservation res WHERE res.status IN ('PENDING','CONFIRMED') " +
           "AND res.checkInDate < :checkOut AND res.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    long countByStatus(RoomStatus status);
}