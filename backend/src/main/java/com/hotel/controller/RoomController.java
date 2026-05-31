package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.room.DateAvailability;
import com.hotel.dto.room.RoomRequest;
import com.hotel.dto.room.RoomResponse;
import com.hotel.dto.room.RoomStatusUpdateRequest;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ApiResponse<List<RoomResponse>> findAll(@RequestParam(required = false) RoomStatus status) {
        if (status != null) {
            return ApiResponse.success(roomService.findByStatus(status));
        }
        return ApiResponse.success(roomService.findAll());
    }

    @GetMapping("/available")
    public ApiResponse<List<RoomResponse>> findAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Long roomTypeId,
            @RequestParam(defaultValue = "price") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) Integer floor) {
        return ApiResponse.success(roomService.findAvailableRooms(checkIn, checkOut, floor, sortBy, sortDir));
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(roomService.findById(id));
    }

    @GetMapping("/{id}/availability")
    public ApiResponse<List<DateAvailability>> getRoomAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate month) {
        return ApiResponse.success(roomService.getRoomAvailability(id, month));
    }

    @PostMapping
    public ApiResponse<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return ApiResponse.success(roomService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomResponse> update(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ApiResponse.success(roomService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<RoomResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody RoomStatusUpdateRequest request) {
        return ApiResponse.success(roomService.updateStatus(id, request.getStatus()));
    }
}