package com.hotel.dto.checkin;

import com.hotel.dto.reservation.ReservationResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CheckInResponse {
    private Long id;
    private LocalDateTime actualCheckIn;
    private LocalDateTime actualCheckOut;
    private String status;
    private BigDecimal deposit;
    private String notes;
    private ReservationResponse reservation;
}