package com.hotel.dto.checkin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckInRequest {
    @NotNull(message = "预订ID不能为空")
    private Long reservationId;
    private BigDecimal deposit;
    private String notes;
}