package com.hotel.dto.room;

import com.hotel.dto.roomtype.RoomTypeResponse;
import lombok.Data;

@Data
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Integer floor;
    private String status;
    private RoomTypeResponse roomType;
    private Double avgRating;
    private Integer reviewCount;
    private Boolean isFavorited;
}