package com.hotel.dto.favorite;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FavoriteResponse {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private Double basePrice;
    private Integer maxGuests;
    private String floor;
    private String status;
    private Double avgRating;
    private LocalDateTime createdAt;
}