package com.hotel.dto.dashboard;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RevenueStats {
    private BigDecimal totalRevenue;
    private BigDecimal averageDailyRevenue;
    private List<RevenueByPeriod> trend;
    private List<RevenueByType> byRoomType;
    private List<RevenueByFloor> byFloor;

    @Data
    public static class RevenueByPeriod {
        private String period;
        private BigDecimal revenue;
        private int bookingCount;
    }

    @Data
    public static class RevenueByType {
        private String roomType;
        private BigDecimal revenue;
        private double percentage;
    }

    @Data
    public static class RevenueByFloor {
        private int floor;
        private BigDecimal revenue;
        private int bookingCount;
    }
}
