package com.hotel.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomRequest {
    @NotBlank(message = "房间号不能为空")
    private String roomNumber;
    @NotNull(message = "楼层不能为空")
    private Integer floor;
    @NotNull(message = "房间类型ID不能为空")
    private Long roomTypeId;
}