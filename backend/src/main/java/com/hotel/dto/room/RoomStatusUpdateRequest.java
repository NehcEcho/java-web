package com.hotel.dto.room;

import com.hotel.entity.enums.RoomStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomStatusUpdateRequest {
    @NotNull(message = "状态不能为空")
    private RoomStatus status;
}