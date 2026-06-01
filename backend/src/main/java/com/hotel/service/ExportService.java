package com.hotel.service;

import com.hotel.entity.Reservation;
import com.hotel.entity.CheckIn;
import com.hotel.entity.User;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.CheckInRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final ReservationRepository reservationRepository;
    private final CheckInRepository checkInRepository;
    private final UserRepository userRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public byte[] exportReservations(LocalDate start, LocalDate end) {
        List<Reservation> reservations;
        if (start != null && end != null) {
            reservations = reservationRepository.findByCreatedAtBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        } else {
            reservations = reservationRepository.findAll();
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("预订记录");
            Row header = sheet.createRow(0);
            String[] columns = {"预订ID", "客户", "房间", "房型", "入住日期", "退房日期", "人数", "总价", "状态", "创建时间"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowNum = 1;
            for (Reservation r : reservations) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(r.getId());
                row.createCell(1).setCellValue(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
                row.createCell(2).setCellValue(r.getRoom().getRoomNumber());
                row.createCell(3).setCellValue(r.getRoom().getRoomType().getName());
                row.createCell(4).setCellValue(r.getCheckInDate().format(DATE_FMT));
                row.createCell(5).setCellValue(r.getCheckOutDate().format(DATE_FMT));
                row.createCell(6).setCellValue(r.getGuestCount());
                row.createCell(7).setCellValue(r.getTotalPrice().doubleValue());
                row.createCell(8).setCellValue(r.getStatus().name());
                row.createCell(9).setCellValue(r.getCreatedAt() != null ? r.getCreatedAt().format(DATETIME_FMT) : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new BusinessException(500, "导出失败: " + e.getMessage());
        }
    }

    public byte[] exportCheckIns(LocalDate start, LocalDate end) {
        List<CheckIn> checkIns;
        if (start != null && end != null) {
            checkIns = checkInRepository.findByActualCheckInBetween(start.atStartOfDay(), end.plusDays(1).atStartOfDay());
        } else {
            checkIns = checkInRepository.findAll();
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("入住记录");
            Row header = sheet.createRow(0);
            String[] columns = {"入住ID", "客户", "房间", "房型", "入住时间", "退房时间", "押金", "状态", "备注"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowNum = 1;
            for (CheckIn ci : checkIns) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(ci.getId());
                row.createCell(1).setCellValue(ci.getReservation().getUser().getName() != null ? ci.getReservation().getUser().getName() : ci.getReservation().getUser().getUsername());
                row.createCell(2).setCellValue(ci.getReservation().getRoom().getRoomNumber());
                row.createCell(3).setCellValue(ci.getReservation().getRoom().getRoomType().getName());
                row.createCell(4).setCellValue(ci.getActualCheckIn() != null ? ci.getActualCheckIn().format(DATETIME_FMT) : "");
                row.createCell(5).setCellValue(ci.getActualCheckOut() != null ? ci.getActualCheckOut().format(DATETIME_FMT) : "");
                row.createCell(6).setCellValue(ci.getDeposit() != null ? ci.getDeposit().doubleValue() : 0);
                row.createCell(7).setCellValue(ci.getStatus().name());
                row.createCell(8).setCellValue(ci.getNotes() != null ? ci.getNotes() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new BusinessException(500, "导出失败: " + e.getMessage());
        }
    }

    public byte[] exportCustomers() {
        List<User> users = userRepository.findAll();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("客户列表");
            Row header = sheet.createRow(0);
            String[] columns = {"用户ID", "用户名", "姓名", "角色", "手机", "邮箱"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowNum = 1;
            for (User u : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(u.getId());
                row.createCell(1).setCellValue(u.getUsername());
                row.createCell(2).setCellValue(u.getName() != null ? u.getName() : "");
                row.createCell(3).setCellValue(u.getRole().name());
                row.createCell(4).setCellValue(u.getPhone() != null ? u.getPhone() : "");
                row.createCell(5).setCellValue(u.getEmail() != null ? u.getEmail() : "");
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new BusinessException(500, "导出失败: " + e.getMessage());
        }
    }
}
