package com.hotel.dto.checkin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ExtendStayRequest {
    @NotNull(message = "新退房日期不能为空")
    private LocalDate newCheckOutDate;
    private String reason;
}
