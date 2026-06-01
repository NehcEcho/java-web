package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.dashboard.CustomerStats;
import com.hotel.dto.dashboard.RevenueStats;
import com.hotel.service.DashboardAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DashboardAnalyticsController {

    private final DashboardAnalyticsService analyticsService;

    @GetMapping("/revenue")
    public ApiResponse<RevenueStats> getRevenueStats(
            @RequestParam(defaultValue = "daily") String period) {
        return ApiResponse.success(analyticsService.getRevenueStats(period));
    }

    @GetMapping("/customers")
    public ApiResponse<CustomerStats> getCustomerStats() {
        return ApiResponse.success(analyticsService.getCustomerStats());
    }
}
