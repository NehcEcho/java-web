package com.hotel.service;

import com.hotel.dto.dashboard.CustomerStats;
import com.hotel.dto.dashboard.RevenueStats;
import com.hotel.entity.Reservation;
import com.hotel.entity.User;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;

    public RevenueStats getRevenueStats(String period) {
        LocalDate now = LocalDate.now();
        LocalDate startDate;
        DateTimeFormatter formatter;

        switch (period) {
            case "week":
                startDate = now.minusDays(6);
                formatter = DateTimeFormatter.ofPattern("MM-dd");
                break;
            case "month":
                startDate = now.minusDays(29);
                formatter = DateTimeFormatter.ofPattern("MM-dd");
                break;
            case "year":
                startDate = now.minusMonths(11).withDayOfMonth(1);
                formatter = DateTimeFormatter.ofPattern("yyyy-MM");
                break;
            default: // daily
                startDate = now.minusDays(6);
                formatter = DateTimeFormatter.ofPattern("MM-dd");
                break;
        }

        List<Reservation> reservations = reservationRepository.findCompletedReservationsInRange(startDate, now.plusDays(1));

        RevenueStats stats = new RevenueStats();
        BigDecimal totalRevenue = reservations.stream()
                .map(Reservation::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTotalRevenue(totalRevenue);

        // Trend
        Map<String, List<Reservation>> grouped;
        if ("year".equals(period)) {
            grouped = reservations.stream()
                    .collect(Collectors.groupingBy(r -> r.getCreatedAt().format(formatter)));
        } else {
            grouped = reservations.stream()
                    .collect(Collectors.groupingBy(r -> r.getCreatedAt().toLocalDate().format(formatter)));
        }

        List<RevenueStats.RevenueByPeriod> trend = new ArrayList<>();
        LocalDate current = startDate;
        while (!current.isAfter(now)) {
            String key;
            if ("year".equals(period)) {
                key = current.format(formatter);
                current = current.plusMonths(1);
            } else {
                key = current.format(formatter);
                current = current.plusDays(1);
            }
            List<Reservation> dayReservations = grouped.getOrDefault(key, Collections.emptyList());
            RevenueStats.RevenueByPeriod periodData = new RevenueStats.RevenueByPeriod();
            periodData.setPeriod(key);
            periodData.setRevenue(dayReservations.stream().map(Reservation::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add));
            periodData.setBookingCount(dayReservations.size());
            trend.add(periodData);
        }
        stats.setTrend(trend);

        // By room type
        Map<String, BigDecimal> byType = reservations.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getRoom().getRoomType().getName(),
                        Collectors.reducing(BigDecimal.ZERO, Reservation::getTotalPrice, BigDecimal::add)
                ));
        List<RevenueStats.RevenueByType> byRoomType = byType.entrySet().stream()
                .map(e -> {
                    RevenueStats.RevenueByType item = new RevenueStats.RevenueByType();
                    item.setRoomType(e.getKey());
                    item.setRevenue(e.getValue());
                    item.setPercentage(totalRevenue.compareTo(BigDecimal.ZERO) == 0 ? 0 :
                            e.getValue().multiply(BigDecimal.valueOf(100)).divide(totalRevenue, 1, RoundingMode.HALF_UP).doubleValue());
                    return item;
                })
                .sorted(Comparator.comparing(RevenueStats.RevenueByType::getRevenue).reversed())
                .collect(Collectors.toList());
        stats.setByRoomType(byRoomType);

        // By floor
        Map<Integer, BigDecimal> byFloor = reservations.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getRoom().getFloor(),
                        Collectors.reducing(BigDecimal.ZERO, Reservation::getTotalPrice, BigDecimal::add)
                ));
        List<RevenueStats.RevenueByFloor> floorStats = byFloor.entrySet().stream()
                .map(e -> {
                    RevenueStats.RevenueByFloor item = new RevenueStats.RevenueByFloor();
                    item.setFloor(e.getKey());
                    item.setRevenue(e.getValue());
                    item.setBookingCount((int) reservations.stream()
                            .filter(r -> r.getRoom().getFloor() == e.getKey())
                            .count());
                    return item;
                })
                .sorted(Comparator.comparingInt(RevenueStats.RevenueByFloor::getFloor))
                .collect(Collectors.toList());
        stats.setByFloor(floorStats);

        // Average daily revenue
        long days = Math.max(1, java.time.temporal.ChronoUnit.DAYS.between(startDate, now) + 1);
        stats.setAverageDailyRevenue(totalRevenue.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP));

        return stats;
    }

    public CustomerStats getCustomerStats() {
        List<Object[]> returningData = reservationRepository.findReturningCustomers();
        List<Object[]> spendingData = reservationRepository.findCustomerSpending();
        List<Object[]> topData = reservationRepository.findTopCustomers();

        CustomerStats stats = new CustomerStats();
        int totalCustomers = spendingData.size();
        int returningCustomers = returningData.size();
        stats.setTotalCustomers(totalCustomers);
        stats.setReturningCustomers(returningCustomers);
        stats.setReturningRate(totalCustomers == 0 ? 0 :
                Math.round(returningCustomers * 1000.0 / totalCustomers) / 10.0);

        // Customer tiers
        int vipCount = 0, regularCount = 0, newCount = 0;
        for (Object[] row : spendingData) {
            BigDecimal totalSpent = (BigDecimal) row[1];
            long bookingCount = (long) row[2];
            if (totalSpent.compareTo(BigDecimal.valueOf(5000)) >= 0 || bookingCount >= 5) {
                vipCount++;
            } else if (bookingCount >= 2) {
                regularCount++;
            } else {
                newCount++;
            }
        }

        List<CustomerStats.CustomerTier> tiers = new ArrayList<>();
        tiers.add(createTier("VIP", vipCount, totalCustomers));
        tiers.add(createTier("普通", regularCount, totalCustomers));
        tiers.add(createTier("新客户", newCount, totalCustomers));
        stats.setTiers(tiers);

        // Spending distribution
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put("0-500", 0);
        distribution.put("500-1000", 0);
        distribution.put("1000-3000", 0);
        distribution.put("3000-5000", 0);
        distribution.put("5000+", 0);
        for (Object[] row : spendingData) {
            BigDecimal totalSpent = (BigDecimal) row[1];
            if (totalSpent.compareTo(BigDecimal.valueOf(500)) < 0) distribution.merge("0-500", 1, Integer::sum);
            else if (totalSpent.compareTo(BigDecimal.valueOf(1000)) < 0) distribution.merge("500-1000", 1, Integer::sum);
            else if (totalSpent.compareTo(BigDecimal.valueOf(3000)) < 0) distribution.merge("1000-3000", 1, Integer::sum);
            else if (totalSpent.compareTo(BigDecimal.valueOf(5000)) < 0) distribution.merge("3000-5000", 1, Integer::sum);
            else distribution.merge("5000+", 1, Integer::sum);
        }
        List<CustomerStats.SpendingDistribution> spendingList = distribution.entrySet().stream()
                .map(e -> {
                    CustomerStats.SpendingDistribution item = new CustomerStats.SpendingDistribution();
                    item.setRange(e.getKey());
                    item.setCount(e.getValue());
                    return item;
                })
                .collect(Collectors.toList());
        stats.setSpendingDistribution(spendingList);

        // Top customers
        List<CustomerStats.TopCustomer> topCustomers = new ArrayList<>();
        for (Object[] row : topData) {
            if (topCustomers.size() >= 10) break;
            Long userId = (Long) row[0];
            Long bookingCount = (Long) row[1];
            BigDecimal totalSpent = (BigDecimal) row[2];
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) continue;

            CustomerStats.TopCustomer tc = new CustomerStats.TopCustomer();
            tc.setUserId(userId);
            tc.setName(user.getName() != null ? user.getName() : user.getUsername());
            tc.setBookingCount(bookingCount.intValue());
            tc.setTotalSpent(totalSpent);
            tc.setTier(totalSpent.compareTo(BigDecimal.valueOf(5000)) >= 0 || bookingCount >= 5 ? "VIP" : "普通");
            topCustomers.add(tc);
        }
        stats.setTopCustomers(topCustomers);

        return stats;
    }

    private CustomerStats.CustomerTier createTier(String tier, int count, int total) {
        CustomerStats.CustomerTier item = new CustomerStats.CustomerTier();
        item.setTier(tier);
        item.setCount(count);
        item.setPercentage(total == 0 ? 0 : Math.round(count * 1000.0 / total) / 10.0);
        return item;
    }
}
