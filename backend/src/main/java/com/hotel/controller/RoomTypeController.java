package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.roomtype.RoomTypeRequest;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ApiResponse<List<RoomTypeResponse>> findAll() {
        return ApiResponse.success(roomTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomTypeResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(roomTypeService.findById(id));
    }

    @PostMapping
    public ApiResponse<RoomTypeResponse> create(@Valid @RequestBody RoomTypeRequest request) {
        return ApiResponse.success(roomTypeService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomTypeResponse> update(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        return ApiResponse.success(roomTypeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roomTypeService.delete(id);
        return ApiResponse.success("删除成功", null);
    }
}