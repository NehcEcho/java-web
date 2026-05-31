package com.hotel.controller;

import com.hotel.dto.auth.*;
import com.hotel.security.CustomUserDetailsService;
import com.hotel.security.JwtTokenProvider;
import com.hotel.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void register_shouldCreateUser() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password123");
        request.setName("New User");

        AuthResponse authResponse = new AuthResponse("test-jwt-token", "newuser", "CUSTOMER", 1L);
        when(authService.register(any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.data.username").value("newuser"));
    }

    @Test
    void login_shouldReturnToken() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        AuthResponse authResponse = new AuthResponse("test-jwt-token", "testuser", "CUSTOMER", 1L);
        when(authService.login(any())).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").value("test-jwt-token"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void getProfile_shouldReturnProfile() throws Exception {
        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(1L);
        profile.setUsername("testuser");
        profile.setRole("CUSTOMER");
        profile.setName("Test User");
        profile.setEmail("test@test.com");

        when(authService.getProfile("testuser")).thenReturn(profile);

        mockMvc.perform(get("/api/auth/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("testuser"))
                .andExpect(jsonPath("$.data.name").value("Test User"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void updateProfile_shouldUpdateProfile() throws Exception {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Updated Name");
        request.setPhone("9999999999");

        UserProfileResponse profile = new UserProfileResponse();
        profile.setId(1L);
        profile.setUsername("testuser");
        profile.setName("Updated Name");
        profile.setPhone("9999999999");

        when(authService.updateProfile(eq("testuser"), any())).thenReturn(profile);

        mockMvc.perform(put("/api/auth/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Updated Name"));
    }

    @Test
    @WithMockUser(username = "testuser")
    void changePassword_shouldSucceed() throws Exception {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("oldPassword");
        request.setNewPassword("newPassword");

        doNothing().when(authService).changePassword(eq("testuser"), any());

        mockMvc.perform(put("/api/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
