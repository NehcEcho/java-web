package com.hotel.dto.checkin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TransferRoomRequest {
    @NotBlank(message = "新房间号不能为空")
    private String newRoomNumber;
    private String reason;
}
