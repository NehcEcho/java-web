package com.hotel.service;

import com.hotel.dto.auth.*;
import com.hotel.entity.User;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.security.CustomUserDetailsService;
import com.hotel.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthService authService;

    private User createUser() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setPassword("encodedPassword");
        user.setRole(UserRole.CUSTOMER);
        user.setName("Test User");
        user.setPhone("1234567890");
        user.setEmail("test@test.com");
        return user;
    }

    private UserDetails createUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }

    @Test
    void register_shouldCreateUserSuccessfully() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setPassword("password123");
        request.setName("New User");
        request.setPhone("1111111111");
        request.setEmail("new@test.com");

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> {
            User u = inv.getArgument(0);
            u.setId(2L);
            return u;
        });
        when(userDetailsService.loadUserByUsername("newuser"))
                .thenReturn(createUserDetails(createUser()));
        when(jwtTokenProvider.generateToken(any())).thenReturn("test-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals("newuser", response.getUsername());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenDuplicateUsername() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setPassword("password123");

        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        BusinessException ex = assertThrows(BusinessException.class,
                () -> authService.register(request));
        assertEquals("用户名已存在", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnValidToken() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("password123");

        User user = createUser();
        UserDetails userDetails = createUserDetails(user);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(jwtTokenProvider.generateToken(userDetails)).thenReturn("test-jwt-token");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("test-jwt-token", response.getToken());
        assertEquals("testuser", response.getUsername());
        assertEquals("CUSTOMER", response.getRole());
    }

    @Test
    void login_shouldThrowWithWrongPassword() {
        LoginRequest request = new LoginRequest();
        request.setUsername("testuser");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("用户名或密码错误"));

        assertThrows(BadCredentialsException.class,
                () -> authService.login(request));
    }

    @Test
    void getProfile_shouldReturnUserInfo() {
        User user = createUser();
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserProfileResponse response = authService.getProfile("testuser");

        assertNotNull(response);
        assertEquals("testuser", response.getUsername());
        assertEquals("Test User", response.getName());
        assertEquals("test@test.com", response.getEmail());
    }

    @Test
    void updateProfile_shouldUpdateUserFields() {
        User user = createUser();
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Updated Name");
        request.setPhone("9999999999");
        request.setEmail("updated@test.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        UserProfileResponse response = authService.updateProfile("testuser", request);

        assertNotNull(response);
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_shouldThrowWithWrongOldPassword() {
        User user = createUser();
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("wrongOldPassword");
        request.setNewPassword("newPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongOldPassword", "encodedPassword")).thenReturn(false);

        BusinessException ex = assertThrows(BusinessException.class,
                () -> authService.changePassword("testuser", request));
        assertEquals("原密码错误", ex.getMessage());
    }

    @Test
    void changePassword_shouldSucceedWithCorrectOldPassword() {
        User user = createUser();
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setOldPassword("correctOldPassword");
        request.setNewPassword("newPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("correctOldPassword", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        assertDoesNotThrow(() -> authService.changePassword("testuser", request));
        verify(userRepository).save(user);
    }

    @Test
    void getAllUsers_shouldReturnAllUsers() {
        User user1 = createUser();
        User user2 = createUser();
        user2.setId(2L);
        user2.setUsername("anotheruser");

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        List<UserProfileResponse> users = authService.getAllUsers();

        assertNotNull(users);
        assertEquals(2, users.size());
    }
}
