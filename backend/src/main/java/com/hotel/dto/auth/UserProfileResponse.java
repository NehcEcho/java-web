package com.hotel.dto.auth;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String username;
    private String role;
    private String name;
    private String phone;
    private String email;
}