package com.hotel.dto.reservation;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {
    @NotNull(message = "房间ID不能为空")
    private Long roomId;
    @NotNull(message = "入住日期不能为空")
    private LocalDate checkInDate;
    @NotNull(message = "退房日期不能为空")
    private LocalDate checkOutDate;
    @NotNull(message = "入住人数不能为空")
    private Integer guestCount;
    private String specialRequests;
}