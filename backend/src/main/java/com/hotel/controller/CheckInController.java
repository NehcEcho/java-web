package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.checkin.CheckInRequest;
import com.hotel.dto.checkin.CheckInResponse;
import com.hotel.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/check-ins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    public ApiResponse<CheckInResponse> checkIn(@Valid @RequestBody CheckInRequest request) {
        return ApiResponse.success(checkInService.checkIn(request));
    }

    @PatchMapping("/{id}/check-out")
    public ApiResponse<CheckInResponse> checkOut(@PathVariable Long id) {
        return ApiResponse.success(checkInService.checkOut(id));
    }

    @GetMapping
    public ApiResponse<List<CheckInResponse>> findAll() {
        return ApiResponse.success(checkInService.findAll());
    }
}