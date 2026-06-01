package com.hotel.service;

import com.hotel.entity.CheckIn;
import com.hotel.entity.Reservation;
import com.hotel.exception.BusinessException;
import com.hotel.repository.CheckInRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final CheckInRepository checkInRepository;
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    public byte[] generateInvoice(Long checkInId) {
        CheckIn checkIn = checkInRepository.findById(checkInId)
                .orElseThrow(() -> new BusinessException("入住记录不存在"));
        if (checkIn.getStatus().name().equals("STAYING")) {
            throw new BusinessException("客人未退房，无法生成发票");
        }

        Reservation r = checkIn.getReservation();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document doc = new Document(PageSize.A4, 50, 50, 50, 50);
            PdfWriter.getInstance(doc, baos);
            doc.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

            Paragraph title = new Paragraph("酒店发票", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            doc.add(title);

            doc.add(new Paragraph("发票编号: INV-" + String.format("%06d", checkInId), headerFont));
            doc.add(new Paragraph("开具日期: " + java.time.LocalDate.now().format(DATE_FMT), normalFont));
            doc.add(new Paragraph(" "));

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingBefore(10);
            infoTable.setSpacingAfter(10);

            addInfoRow(infoTable, "客户姓名", r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername(), normalFont);
            addInfoRow(infoTable, "房间号码", r.getRoom().getRoomNumber(), normalFont);
            addInfoRow(infoTable, "房间类型", r.getRoom().getRoomType().getName(), normalFont);
            addInfoRow(infoTable, "入住日期", r.getCheckInDate().format(DATE_FMT), normalFont);
            addInfoRow(infoTable, "退房日期", r.getCheckOutDate().format(DATE_FMT), normalFont);
            addInfoRow(infoTable, "实际入住", checkIn.getActualCheckIn() != null ? checkIn.getActualCheckIn().format(DATETIME_FMT) : "-", normalFont);
            addInfoRow(infoTable, "实际退房", checkIn.getActualCheckOut() != null ? checkIn.getActualCheckOut().format(DATETIME_FMT) : "-", normalFont);
            addInfoRow(infoTable, "入住人数", String.valueOf(r.getGuestCount()), normalFont);
            doc.add(infoTable);

            doc.add(new Paragraph(" "));

            PdfPTable priceTable = new PdfPTable(2);
            priceTable.setWidthPercentage(60);
            priceTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
            priceTable.setSpacingBefore(10);

            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(new java.awt.Color(245, 245, 245));
            headerCell.setPadding(8);

            PdfPCell h1 = new PdfPCell(new Phrase("项目", headerFont));
            h1.setBackgroundColor(new java.awt.Color(245, 245, 245));
            h1.setPadding(8);
            priceTable.addCell(h1);

            PdfPCell h2 = new PdfPCell(new Phrase("金额", headerFont));
            h2.setBackgroundColor(new java.awt.Color(245, 245, 245));
            h2.setPadding(8);
            h2.setHorizontalAlignment(Element.ALIGN_RIGHT);
            priceTable.addCell(h2);

            priceTable.addCell(new Phrase("住宿费用", normalFont));
            PdfPCell amountCell = new PdfPCell(new Phrase("¥" + r.getTotalPrice().toString(), normalFont));
            amountCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
            amountCell.setPadding(8);
            priceTable.addCell(amountCell);

            if (checkIn.getDeposit() != null && checkIn.getDeposit().doubleValue() > 0) {
                priceTable.addCell(new Phrase("押金", normalFont));
                PdfPCell depositCell = new PdfPCell(new Phrase("¥" + checkIn.getDeposit().toString(), normalFont));
                depositCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                depositCell.setPadding(8);
                priceTable.addCell(depositCell);
            }

            doc.add(priceTable);

            doc.add(new Paragraph(" "));
            Paragraph total = new Paragraph("合计: ¥" + r.getTotalPrice().toString(), headerFont);
            total.setAlignment(Element.ALIGN_RIGHT);
            total.setSpacingBefore(20);
            doc.add(total);

            doc.add(new Paragraph(" "));
            doc.add(new Paragraph(" "));
            Paragraph footer = new Paragraph("感谢您选择我们酒店，期待您的再次光临！", smallFont);
            footer.setAlignment(Element.ALIGN_CENTER);
            doc.add(footer);

            doc.close();
        } catch (Exception e) {
            throw new BusinessException("生成发票失败: " + e.getMessage());
        }

        return baos.toByteArray();
    }

    private void addInfoRow(PdfPTable table, String label, String value, Font font) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }
}
