package com.hotel.controller;

import com.hotel.dto.room.DateAvailability;
import com.hotel.dto.room.RoomResponse;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.security.CustomUserDetailsService;
import com.hotel.security.JwtTokenProvider;
import com.hotel.service.RoomService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RoomController.class)
@AutoConfigureMockMvc(addFilters = false)
class RoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RoomService roomService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private RoomResponse createRoomResponse() {
        RoomTypeResponse roomType = new RoomTypeResponse();
        roomType.setId(1L);
        roomType.setName("标准间");
        roomType.setBasePrice(new BigDecimal("200.00"));
        roomType.setMaxGuests(2);

        RoomResponse response = new RoomResponse();
        response.setId(1L);
        response.setRoomNumber("101");
        response.setFloor(1);
        response.setStatus("AVAILABLE");
        response.setRoomType(roomType);
        response.setAvgRating(4.5);
        response.setReviewCount(10);
        response.setIsFavorited(false);
        return response;
    }

    @Test
    @WithMockUser
    void getAll_shouldReturnRoomList() throws Exception {
        when(roomService.findAll()).thenReturn(List.of(createRoomResponse()));

        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].roomNumber").value("101"));
    }

    @Test
    void getById_shouldReturnRoom() throws Exception {
        when(roomService.findById(1L)).thenReturn(createRoomResponse());

        mockMvc.perform(get("/api/rooms/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.roomNumber").value("101"))
                .andExpect(jsonPath("$.data.status").value("AVAILABLE"));
    }

    @Test
    @WithMockUser
    void getAvailability_shouldReturnDates() throws Exception {
        DateAvailability date1 = new DateAvailability("2026-06-01", true);
        DateAvailability date2 = new DateAvailability("2026-06-02", false);
        when(roomService.getRoomAvailability(eq(1L), any())).thenReturn(List.of(date1, date2));

        mockMvc.perform(get("/api/rooms/1/availability")
                        .param("month", "2026-06-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].date").value("2026-06-01"))
                .andExpect(jsonPath("$.data[0].available").value(true))
                .andExpect(jsonPath("$.data[1].date").value("2026-06-02"))
                .andExpect(jsonPath("$.data[1].available").value(false));
    }
}
