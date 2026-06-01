package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.reservation.BatchReservationRequest;
import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.User;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    @PostMapping
    public ApiResponse<ReservationResponse> create(@Valid @RequestBody ReservationRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(reservationService.create(request, userId));
    }

    @PostMapping("/batch")
    public ApiResponse<List<ReservationResponse>> createBatch(@Valid @RequestBody BatchReservationRequest request,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(reservationService.createBatch(request.getReservations(), userId));
    }

    @GetMapping
    public ApiResponse<List<ReservationResponse>> list(@AuthenticationPrincipal UserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_ADMIN")) {
            return ApiResponse.success(reservationService.findAll());
        }
        return ApiResponse.success(reservationService.findByUserId(getUserId(userDetails)));
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(reservationService.findById(id));
    }

    @PatchMapping("/{id}/confirm")
    public ApiResponse<ReservationResponse> confirm(@PathVariable Long id) {
        return ApiResponse.success(reservationService.confirm(id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<ReservationResponse> cancel(@PathVariable Long id) {
        return ApiResponse.success(reservationService.cancel(id));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BusinessException("用户不存在")).getId();
    }
}