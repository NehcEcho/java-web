package com.hotel.dto.review;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String content;
    private String username;
    private Long roomId;
    private Boolean visible;
    private LocalDateTime createdAt;
}