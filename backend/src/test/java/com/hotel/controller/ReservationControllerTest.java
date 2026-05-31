package com.hotel.controller;

import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.User;
import com.hotel.entity.enums.UserRole;
import com.hotel.repository.UserRepository;
import com.hotel.security.CustomUserDetailsService;
import com.hotel.security.JwtTokenProvider;
import com.hotel.service.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
@AutoConfigureMockMvc(addFilters = false)
class ReservationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ReservationService reservationService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    private User createMockUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("user");
        user.setRole(UserRole.CUSTOMER);
        return user;
    }

    private ReservationResponse createResponse() {
        ReservationResponse response = new ReservationResponse();
        response.setId(1L);
        response.setCheckInDate(LocalDate.now().plusDays(1));
        response.setCheckOutDate(LocalDate.now().plusDays(3));
        response.setStatus("PENDING");
        response.setTotalPrice(new BigDecimal("400.00"));
        response.setGuestCount(2);
        response.setRoomNumber("101");
        response.setRoomType("标准间");
        response.setUserId(1L);
        response.setUserName("user");
        return response;
    }

    @Test
    @WithMockUser(username = "user")
    void create_shouldSucceed() throws Exception {
        ReservationRequest request = new ReservationRequest();
        request.setRoomId(1L);
        request.setCheckInDate(LocalDate.now().plusDays(1));
        request.setCheckOutDate(LocalDate.now().plusDays(3));
        request.setGuestCount(2);

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(createMockUser()));
        when(reservationService.create(any(), eq(1L))).thenReturn(createResponse());

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.status").value("PENDING"));
    }

    @Test
    @WithMockUser(username = "user")
    void create_shouldReturn400WhenDatesInvalid() throws Exception {
        ReservationRequest request = new ReservationRequest();
        request.setRoomId(1L);
        request.setCheckInDate(null);
        request.setCheckOutDate(LocalDate.now().plusDays(3));
        request.setGuestCount(2);

        when(userRepository.findByUsername("user")).thenReturn(Optional.of(createMockUser()));

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = "ADMIN")
    void getAll_shouldReturnList() throws Exception {
        when(userRepository.findByUsername("user")).thenReturn(Optional.of(createMockUser()));
        when(reservationService.findAll()).thenReturn(List.of(createResponse()));

        mockMvc.perform(get("/api/reservations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].id").value(1));
    }

    @Test
    @WithMockUser
    void confirm_shouldReturnConfirmed() throws Exception {
        ReservationResponse response = createResponse();
        response.setStatus("CONFIRMED");

        when(reservationService.confirm(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/reservations/1/confirm"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
    }

    @Test
    @WithMockUser
    void cancel_shouldReturnCancelled() throws Exception {
        ReservationResponse response = createResponse();
        response.setStatus("CANCELLED");

        when(reservationService.cancel(1L)).thenReturn(response);

        mockMvc.perform(patch("/api/reservations/1/cancel"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("CANCELLED"));
    }
}
