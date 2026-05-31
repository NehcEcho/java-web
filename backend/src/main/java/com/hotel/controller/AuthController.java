package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.auth.*;
import com.hotel.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }

    @GetMapping("/profile")
    public ApiResponse<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        return ApiResponse.success(authService.getProfile(userDetails.getUsername()));
    }

    @PutMapping("/profile")
    public ApiResponse<UserProfileResponse> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                            @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success(authService.updateProfile(userDetails.getUsername(), request));
    }

    @PutMapping("/password")
    public ApiResponse<Void> changePassword(@AuthenticationPrincipal UserDetails userDetails,
                                             @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userDetails.getUsername(), request);
        return ApiResponse.success(null);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<List<UserProfileResponse>> getAllUsers() {
        return ApiResponse.success(authService.getAllUsers());
    }
}