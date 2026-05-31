package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.favorite.FavoriteResponse;
import com.hotel.entity.User;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    @PostMapping("/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ApiResponse<FavoriteResponse> addFavorite(@PathVariable Long roomId,
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(favoriteService.addFavorite(userId, roomId));
    }

    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ApiResponse<Void> removeFavorite(@PathVariable Long roomId,
                                            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        favoriteService.removeFavorite(userId, roomId);
        return ApiResponse.success("取消收藏成功", null);
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ApiResponse<List<FavoriteResponse>> listFavorites(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(favoriteService.getUserFavorites(userId));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new BusinessException("用户不存在")).getId();
    }
}