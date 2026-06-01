package com.hotel.dto.dashboard;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class CustomerStats {
    private int totalCustomers;
    private int returningCustomers;
    private double returningRate;
    private List<CustomerTier> tiers;
    private List<SpendingDistribution> spendingDistribution;
    private List<TopCustomer> topCustomers;

    @Data
    public static class CustomerTier {
        private String tier;
        private int count;
        private double percentage;
    }

    @Data
    public static class SpendingDistribution {
        private String range;
        private int count;
    }

    @Data
    public static class TopCustomer {
        private Long userId;
        private String name;
        private int bookingCount;
        private BigDecimal totalSpent;
        private String tier;
    }
}
