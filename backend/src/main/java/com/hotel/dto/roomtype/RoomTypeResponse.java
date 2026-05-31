package com.hotel.dto.roomtype;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeResponse {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private Integer maxGuests;
    private String description;
    private String amenities;
}