package com.hotel.dto.checkin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransferRoomRequest {
    @NotNull(message = "新房间ID不能为空")
    private Long newRoomId;
    private String reason;
}
