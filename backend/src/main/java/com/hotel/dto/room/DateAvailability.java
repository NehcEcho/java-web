package com.hotel.dto.room;

import lombok.Data;

@Data
public class DateAvailability {
    private String date;
    private boolean available;

    public DateAvailability() {
    }

    public DateAvailability(String date, boolean available) {
        this.date = date;
        this.available = available;
    }
}