package com.hotel.dto.reservation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class BatchReservationRequest {
    @NotEmpty(message = "预订列表不能为空")
    @Valid
    private List<ReservationRequest> reservations;
}
