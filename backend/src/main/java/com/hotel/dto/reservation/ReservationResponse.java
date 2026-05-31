package com.hotel.dto.reservation;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;
    private BigDecimal totalPrice;
    private Integer guestCount;
    private String specialRequests;
    private String roomNumber;
    private String roomType;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
}