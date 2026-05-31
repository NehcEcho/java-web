package com.hotel.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private long reservedRooms;
    private long totalRooms;
    private long todayCheckIns;
    private long todayCheckOuts;
    private long pendingReservations;
}