package com.hotel.dto.roomtype;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeRequest {
    @NotBlank(message = "房间类型名称不能为空")
    private String name;
    @NotNull(message = "价格不能为空")
    private BigDecimal basePrice;
    @NotNull(message = "最大入住人数不能为空")
    private Integer maxGuests;
    private String description;
    private String amenities;
}