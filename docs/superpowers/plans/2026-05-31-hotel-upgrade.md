# 酒店管理系统 — 功能增强与 UI/UX 全量升级 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use @subagent-driven-development (recommended) or @executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在现有酒店管理系统上增加评价系统、房间收藏、排序筛选、订单详情页，同时全面升级 UI/UX 品质。

**Architecture:** 渐进升级 — 后端新增 Review/Favorite 两个实体和对应 CRUD API，房间搜索增加排序筛选参数；前端新增 5 个共享组件、3 个新页面、升级所有现有页面的 UI 细节。

**Tech Stack:** Spring Boot 3.2+ / Java 17 / SQLite / React 18 / TypeScript / Vite / Tailwind CSS / shadcn/ui

---

## File Structure

### Backend — New Files

| File | 职责 |
|------|------|
| `entity/Review.java` | 评价实体 |
| `entity/Favorite.java` | 收藏实体 |
| `repository/ReviewRepository.java` | 评价数据访问 |
| `repository/FavoriteRepository.java` | 收藏数据访问 |
| `dto/review/ReviewResponse.java` | 评价响应 DTO |
| `dto/review/ReviewRequest.java` | 评价请求 DTO |
| `dto/favorite/FavoriteResponse.java` | 收藏响应 DTO |
| `service/ReviewService.java` | 评价业务逻辑 |
| `service/FavoriteService.java` | 收藏业务逻辑 |
| `controller/ReviewController.java` | 评价 API |
| `controller/FavoriteController.java` | 收藏 API |

### Backend — Modified Files

| File | 改动 |
|------|------|
| `entity/Room.java` | 添加 `reviews` 和 `favorites` 关联 |
| `repository/RoomRepository.java` | 添加按楼层查询方法 |
| `controller/RoomController.java` | 可用房间 API 增加 sortBy/sortDir/floor 参数 |
| `service/RoomService.java` | 可用房间查询增加排序和楼层筛选逻辑 |
| `dto/room/RoomResponse.java` | 增加 `avgRating`、`reviewCount`、`isFavorited` 字段 |

### Frontend — New Files

| File | 职责 |
|------|------|
| `components/shared/Skeleton.tsx` | 骨架屏组件 |
| `components/shared/Breadcrumb.tsx` | 面包屑导航组件 |
| `components/shared/ConfirmDialog.tsx` | 确认对话框组件 |
| `components/shared/StarRating.tsx` | 5星评分组件 |
| `components/shared/FavoriteButton.tsx` | 收藏按钮组件 |
| `api/reviews.ts` | 评价 API |
| `api/favorites.ts` | 收藏 API |
| `pages/customer/MyFavoritesPage.tsx` | 收藏列表页 |
| `pages/customer/ReservationDetailPage.tsx` | 订单详情页 |
| `pages/admin/ReviewsPage.tsx` | 评价管理页 |

### Frontend — Modified Files

| File | 改动 |
|------|------|
| `App.tsx` | 添加新路由 |
| `components/customer/CustomerLayout.tsx` | 升级导航 |
| `components/admin/AdminLayout.tsx` | 添加评价管理菜单 |
| `hooks/useAuth.tsx` | 添加 favorites 相关状态 |
| `lib/utils.ts` | 添加 formatDateFull |
| `pages/customer/HomePage.tsx` | UI 升级 |
| `pages/customer/CustomerRoomsPage.tsx` | 添加排序筛选 + UI 升级 |
| `pages/customer/RoomDetailPage.tsx` | 添加评价 + 收藏 + 面包屑 |
| `pages/customer/BookingPage.tsx` | UI 升级 |
| `pages/customer/MyReservationsPage.tsx` | UI 升级 |
| `pages/customer/CustomerLoginPage.tsx` | UI 升级 |
| `pages/admin/DashboardPage.tsx` | 统计卡升级 |
| `pages/admin/RoomsPage.tsx` | 筛选增强 + UI 升级 |
| `pages/admin/ReservationsPage.tsx` | UI 升级 |
| `pages/admin/CheckInsPage.tsx` | UI 升级 |

---

## Task 1: Backend — Review 实体 + Repository

**Files:**
- Create: `backend/src/main/java/com/hotel/entity/Review.java`
- Create: `backend/src/main/java/com/hotel/repository/ReviewRepository.java`

- [ ] **Step 1: Create Review entity**

```java
package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "room_id"})
})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 500)
    private String content;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false)
    private Boolean visible = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

- [ ] **Step 2: Create ReviewRepository**

```java
package com.hotel.repository;

import com.hotel.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(Long roomId);
    List<Review> findAllByOrderByCreatedAtDesc();
    Optional<Review> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    int countByRoomIdAndVisibleTrue(Long roomId);
}
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

---

## Task 2: Backend — Favorite 实体 + Repository

**Files:**
- Create: `backend/src/main/java/com/hotel/entity/Favorite.java`
- Create: `backend/src/main/java/com/hotel/repository/FavoriteRepository.java`

- [ ] **Step 1: Create Favorite entity**

```java
package com.hotel.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "room_id"})
})
public class Favorite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

- [ ] **Step 2: Create FavoriteRepository**

```java
package com.hotel.repository;

import com.hotel.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favorite> findByUserIdAndRoomId(Long userId, Long roomId);
    boolean existsByUserIdAndRoomId(Long userId, Long roomId);
    void deleteByUserIdAndRoomId(Long userId, Long roomId);
}
```

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

---

## Task 3: Backend — Review DTO + Service + Controller

**Files:**
- Create: `backend/src/main/java/com/hotel/dto/review/ReviewResponse.java`
- Create: `backend/src/main/java/com/hotel/dto/review/ReviewRequest.java`
- Create: `backend/src/main/java/com/hotel/service/ReviewService.java`
- Create: `backend/src/main/java/com/hotel/controller/ReviewController.java`

- [ ] **Step 1: Create ReviewRequest DTO**

```java
package com.hotel.dto.review;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ReviewRequest {
    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    @Size(max = 500)
    private String content;
}
```

- [ ] **Step 2: Create ReviewResponse DTO**

```java
package com.hotel.dto.review;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String content;
    private String username;
    private Long roomId;
    private Boolean visible;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 3: Create ReviewService**

```java
package com.hotel.service;

import com.hotel.dto.review.*;
import com.hotel.entity.*;
import com.hotel.exception.BusinessException;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReviewResponse createReview(Long roomId, Long userId, ReviewRequest request) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new BusinessException("房间不存在"));
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("用户不存在"));

        boolean hasCompleted = reservationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .anyMatch(r -> r.getRoom().getId().equals(roomId) && r.getStatus().name().equals("COMPLETED"));
        if (!hasCompleted) {
            throw new BusinessException("只有已完成的订单才能评价");
        }

        if (reviewRepository.existsByUserIdAndRoomId(userId, roomId)) {
            throw new BusinessException("您已评价过此房间");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setUser(user);
        review.setRoom(room);
        review.setVisible(true);
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    public List<ReviewResponse> getRoomReviews(Long roomId) {
        return reviewRepository.findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(roomId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReviewResponse> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public ReviewResponse toggleVisibility(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new BusinessException("评价不存在"));
        review.setVisible(!review.getVisible());
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    private ReviewResponse toResponse(Review r) {
        ReviewResponse res = new ReviewResponse();
        res.setId(r.getId());
        res.setRating(r.getRating());
        res.setContent(r.getContent());
        res.setUsername(r.getUser().getUsername());
        res.setRoomId(r.getRoom().getId());
        res.setVisible(r.getVisible());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    public double getAvgRating(Long roomId) {
        List<Review> reviews = reviewRepository.findByRoomIdAndVisibleTrueOrderByCreatedAtDesc(roomId);
        if (reviews.isEmpty()) return 0;
        return reviews.stream().mapToInt(Review::getRating).average().orElse(0);
    }

    public int getReviewCount(Long roomId) {
        return reviewRepository.countByRoomIdAndVisibleTrue(roomId);
    }
}
```

- [ ] **Step 4: Create ReviewController**

```java
package com.hotel.controller;

import com.hotel.dto.review.*;
import com.hotel.dto.ApiResponse;
import com.hotel.entity.User;
import com.hotel.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/rooms/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @PathVariable Long roomId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((com.hotel.security.CustomUserDetails) userDetails).getUser().getId();
        ReviewResponse response = reviewService.createReview(roomId, userId, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRoomReviews(@PathVariable Long roomId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getRoomReviews(roomId)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getAllReviews() {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getAllReviews()));
    }

    @PatchMapping("/{id}/visibility")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ReviewResponse>> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.toggleVisibility(id)));
    }
}
```

- [ ] **Step 5: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

---

## Task 4: Backend — Favorite DTO + Service + Controller

**Files:**
- Create: `backend/src/main/java/com/hotel/dto/favorite/FavoriteResponse.java`
- Create: `backend/src/main/java/com/hotel/service/FavoriteService.java`
- Create: `backend/src/main/java/com/hotel/controller/FavoriteController.java`

- [ ] **Step 1: Create FavoriteResponse DTO**

```java
package com.hotel.dto.favorite;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FavoriteResponse {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private String roomTypeName;
    private Double basePrice;
    private Integer maxGuests;
    private String floor;
    private String status;
    private Double avgRating;
    private LocalDateTime createdAt;
}
```

- [ ] **Step 2: Create FavoriteService**

```java
package com.hotel.service;

import com.hotel.dto.favorite.*;
import com.hotel.entity.*;
import com.hotel.exception.BusinessException;
import com.hotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final ReviewService reviewService;

    public FavoriteResponse addFavorite(Long userId, Long roomId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new BusinessException("用户不存在"));
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new BusinessException("房间不存在"));

        if (favoriteRepository.existsByUserIdAndRoomId(userId, roomId)) {
            throw new BusinessException("已收藏此房间");
        }

        Favorite fav = new Favorite();
        fav.setUser(user);
        fav.setRoom(room);
        Favorite saved = favoriteRepository.save(fav);
        return toResponse(saved);
    }

    public void removeFavorite(Long userId, Long roomId) {
        favoriteRepository.deleteByUserIdAndRoomId(userId, roomId);
    }

    public List<FavoriteResponse> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public boolean isFavorited(Long userId, Long roomId) {
        return favoriteRepository.existsByUserIdAndRoomId(userId, roomId);
    }

    private FavoriteResponse toResponse(Favorite f) {
        FavoriteResponse res = new FavoriteResponse();
        res.setId(f.getId());
        res.setRoomId(f.getRoom().getId());
        res.setRoomNumber(f.getRoom().getRoomNumber());
        res.setRoomTypeName(f.getRoom().getRoomType().getName());
        res.setBasePrice(f.getRoom().getRoomType().getBasePrice().doubleValue());
        res.setMaxGuests(f.getRoom().getRoomType().getMaxGuests());
        res.setFloor(String.valueOf(f.getRoom().getFloor()));
        res.setStatus(f.getRoom().getStatus().name());
        res.setAvgRating(reviewService.getAvgRating(f.getRoom().getId()));
        res.setCreatedAt(f.getCreatedAt());
        return res;
    }
}
```

- [ ] **Step 3: Create FavoriteController**

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.favorite.*;
import com.hotel.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FavoriteResponse>> addFavorite(
            @PathVariable Long roomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((com.hotel.security.CustomUserDetails) userDetails).getUser().getId();
        return ResponseEntity.ok(ApiResponse.success(favoriteService.addFavorite(userId, roomId)));
    }

    @DeleteMapping("/{roomId}")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable Long roomId,
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((com.hotel.security.CustomUserDetails) userDetails).getUser().getId();
        favoriteService.removeFavorite(userId, roomId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getUserFavorites(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = ((com.hotel.security.CustomUserDetails) userDetails).getUser().getId();
        return ResponseEntity.ok(ApiResponse.success(favoriteService.getUserFavorites(userId)));
    }
}
```

- [ ] **Step 4: Verify backend compiles**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

---

## Task 5: Backend — Room API 增加 sortBy/sortDir/floor 参数

**Files:**
- Modify: `backend/src/main/java/com/hotel/service/RoomService.java`
- Modify: `backend/src/main/java/com/hotel/controller/RoomController.java`
- Modify: `backend/src/main/java/com/hotel/dto/room/RoomResponse.java` — 添加 avgRating, reviewCount, isFavorited

- [ ] **Step 1: Add avgRating, reviewCount, isFavorited to RoomResponse**

在 `RoomResponse.java` 中添加三个字段：

```java
private Double avgRating;
private Integer reviewCount;
private Boolean isFavorited;
```

同时在 `RoomService.toResponse` 方法中设置这些字段：

```java
res.setAvgRating(reviewService.getAvgRating(room.getId()));
res.setReviewCount(reviewService.getReviewCount(room.getId()));
// isFavorited 需要当前用户信息，在 Controller 层补充
```

- [ ] **Step 2: Modify RoomController.getAvailableRooms to accept sortBy/sortDir/floor**

```java
@GetMapping("/available")
public ResponseEntity<ApiResponse<List<RoomResponse>>> getAvailableRooms(
        @RequestParam String checkIn,
        @RequestParam String checkOut,
        @RequestParam(required = false) Long roomTypeId,
        @RequestParam(defaultValue = "price") String sortBy,
        @RequestParam(defaultValue = "asc") String sortDir,
        @RequestParam(required = false) Integer floor,
        @AuthenticationPrincipal UserDetails userDetails) {
    // Pass sortBy, sortDir, floor, roomTypeId to service
}
```

- [ ] **Step 3: Modify RoomService to support sorting and floor filtering**

在可用房间查询方法中增加排序和楼层筛选逻辑，对查询结果用 Stream + Comparator 排序。

- [ ] **Step 4: Verify backend compiles and API works**

Run: `cd backend && mvn compile -q`
Expected: BUILD SUCCESS

Then test: `GET /api/rooms/available?checkIn=2026-06-15&checkOut=2026-06-17&sortBy=price&sortDir=asc&floor=3`

---

## Task 6: Frontend — 共享组件（Skeleton, Breadcrumb, ConfirmDialog, StarRating, FavoriteButton）

**Files:**
- Create: `frontend/src/components/shared/Skeleton.tsx`
- Create: `frontend/src/components/shared/Breadcrumb.tsx`
- Create: `frontend/src/components/shared/ConfirmDialog.tsx`
- Create: `frontend/src/components/shared/StarRating.tsx`
- Create: `frontend/src/components/shared/FavoriteButton.tsx`
- Create: `frontend/src/api/reviews.ts`
- Create: `frontend/src/api/favorites.ts`

- [ ] **Step 1: Create Skeleton component**

Create `frontend/src/components/shared/Skeleton.tsx`:

```tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-xl bg-gray-200', className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 p-6">
      <Skeleton className="h-44 w-full mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 p-6">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Skeleton className="h-4 w-24 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-80 rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Breadcrumb component**

Create `frontend/src/components/shared/Breadcrumb.tsx`:

```tsx
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-gray-900 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Create ConfirmDialog component**

Create `frontend/src/components/shared/ConfirmDialog.tsx`:

```tsx
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

// First add shadcn alert-dialog: npx shadcn@latest add alert-dialog

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({ open, onOpenChange, title, description, confirmText = '确认', cancelText = '取消', onConfirm, variant = 'default' }: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

- [ ] **Step 4: Create StarRating component**

Create `frontend/src/components/shared/StarRating.tsx`:

```tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ rating, onChange, readonly = false, size = 20 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn('transition-colors', readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110')}
        >
          <Star
            className={cn(
              'transition-colors',
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            )}
            style={{ width: size, height: size }}
          />
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create FavoriteButton component**

Create `frontend/src/components/shared/FavoriteButton.tsx`:

```tsx
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addFavorite, removeFavorite } from '@/api/favorites';
import { toast } from 'sonner';

interface FavoriteButtonProps {
  roomId: number;
  initialFavorited: boolean;
  size?: number;
}

export function FavoriteButton({ roomId, initialFavorited, size = 20 }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (favorited) {
        await removeFavorite(roomId);
        setFavorited(false);
        toast.success('已取消收藏');
      } else {
        await addFavorite(roomId);
        setFavorited(true);
        toast.success('已收藏');
      }
    } catch {
      toast.error('操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={toggle} disabled={loading} className="transition-transform hover:scale-110 active:scale-95">
      <Heart
        className={cn(
          'transition-colors',
          favorited ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-red-400'
        )}
        style={{ width: size, height: size }}
      />
    </button>
  );
}
```

- [ ] **Step 6: Create reviews API module**

Create `frontend/src/api/reviews.ts`:

```ts
import api from '@/lib/api';

export interface Review {
  id: number;
  rating: number;
  content: string;
  username: string;
  roomId: number;
  visible: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  rating: number;
  content: string;
}

export function getRoomReviews(roomId: number): Promise<Review[]> {
  return api.get(`/reviews/rooms/${roomId}`).then(res => res.data);
}

export function createReview(roomId: number, data: ReviewRequest): Promise<Review> {
  return api.post(`/reviews/rooms/${roomId}`, data).then(res => res.data);
}

export function getAllReviews(): Promise<Review[]> {
  return api.get('/reviews').then(res => res.data);
}

export function toggleReviewVisibility(id: number): Promise<Review> {
  return api.patch(`/reviews/${id}/visibility`).then(res => res.data);
}
```

- [ ] **Step 7: Create favorites API module**

Create `frontend/src/api/favorites.ts`:

```ts
import api from '@/lib/api';

export interface FavoriteItem {
  id: number;
  roomId: number;
  roomNumber: string;
  roomTypeName: string;
  basePrice: number;
  maxGuests: number;
  floor: string;
  status: string;
  avgRating: number;
  createdAt: string;
}

export function addFavorite(roomId: number): Promise<FavoriteItem> {
  return api.post(`/favorites/${roomId}`).then(res => res.data);
}

export function removeFavorite(roomId: number): Promise<void> {
  return api.delete(`/favorites/${roomId}`).then(res => res.data);
}

export function getFavorites(): Promise<FavoriteItem[]> {
  return api.get('/favorites').then(res => res.data);
}
```

- [ ] **Step 8: Add shadcn alert-dialog component**

Run: `cd frontend && npx shadcn@latest add alert-dialog`
Expected: Component added to `frontend/src/components/ui/alert-dialog.tsx`

- [ ] **Step 9: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 7: Frontend — Update Room type + API (add rating, favorite fields)

**Files:**
- Modify: `frontend/src/api/rooms.ts` — add avgRating, reviewCount, isFavorited to Room type
- Modify: `frontend/src/api/rooms.ts` — add sortBy, sortDir, floor params to getAvailableRooms

- [ ] **Step 1: Update Room interface and getAvailableRooms**

In `rooms.ts`, update `Room` interface to add:

```ts
avgRating: number;
reviewCount: number;
isFavorited: boolean;
```

Update `getAvailableRooms` to accept and pass sort/filter params:

```ts
export async function getAvailableRooms(
  checkIn: string,
  checkOut: string,
  sortBy: string = 'price',
  sortDir: string = 'asc',
  floor?: number,
  roomTypeId?: number
): Promise<Room[]> {
  const params = new URLSearchParams({ checkIn, checkOut, sortBy, sortDir });
  if (floor) params.append('floor', String(floor));
  if (roomTypeId) params.append('roomTypeId', String(roomTypeId));
  const res = await api.get(`/rooms/available?${params.toString()}`);
  return res.data;
}
```

- [ ] **Step 2: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 8: Frontend — Upgrade CustomerRoomsPage (sorting, filtering, UI)

**Files:**
- Modify: `frontend/src/pages/customer/CustomerRoomsPage.tsx`

- [ ] **Step 1: Add sortBy, sortDir, floor state + UI controls**

Add state variables for `sortBy`, `sortDir`, `floor` filter. Add a toolbar row with:
- Sort buttons (价格升序/降序)
- Floor dropdown (全部楼层/3F/4F/5F)
- Keep existing room type filter

Pass these params to `getAvailableRooms()`. Replace "加载中..." text with `<CardSkeleton />` components.

Use `rounded-2xl` cards, `h-11` buttons, update spacing per spec.

- [ ] **Step 2: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 9: Frontend — Upgrade RoomDetailPage (reviews, favorites, breadcrumb)

**Files:**
- Modify: `frontend/src/pages/customer/RoomDetailPage.tsx`

- [ ] **Step 1: Add Breadcrumb, FavoriteButton, review section**

Add `<Breadcrumb>` at top. Add `<FavoriteButton>` on the image area top-right. Add a review section at bottom showing:
- Average rating display (StarRating readonly + numeric average)
- Review list (scrollable, each with username, star rating, content, date)
- Review form (if user is authenticated and has completed order) with StarRating input + textarea

- [ ] **Step 2: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 10: Frontend — New pages (MyFavorites, ReservationDetail)

**Files:**
- Create: `frontend/src/pages/customer/MyFavoritesPage.tsx`
- Create: `frontend/src/pages/customer/ReservationDetailPage.tsx`

- [ ] **Step 1: Create MyFavoritesPage**

Room cards grid (same layout as CustomerRoomsPage). Each card shows room image, room number, room type, price, avg rating, and a remove-from-favorites button. Empty state with icon + text + CTA.

- [ ] **Step 2: Create ReservationDetailPage**

Show full reservation details:
- Breadcrumb: 首页 > 我的预订 > 预订详情
- Room info card with image
- Status timeline (PENDING → CONFIRMED → COMPLETED with step highlighting)
- Detail list: dates, guests, special requests
- Price breakdown
- Action buttons (cancel if pending/confirmed, write review if completed)

- [ ] **Step 3: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 11: Frontend — Admin ReviewsPage

**Files:**
- Create: `frontend/src/pages/admin/ReviewsPage.tsx`

- [ ] **Step 1: Create ReviewsPage**

Table with columns: ID, Room Number, Customer, Rating (stars), Content, Date, Status (visible/hidden), Action (toggle visibility button). Filter by visibility status. Use admin layout.

- [ ] **Step 2: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 12: Frontend — Update App.tsx routes + AdminLayout nav

**Files:**
- Modify: `frontend/src/App.tsx` — add new routes
- Modify: `frontend/src/components/admin/AdminLayout.tsx` — add reviews menu item

- [ ] **Step 1: Add new routes to App.tsx**

Add routes under CustomerLayout:
- `/my-favorites` → `MyFavoritesPage`
- `/my-reservations/:id` → `ReservationDetailPage`

Add route under AdminLayout:
- `/admin/reviews` → `ReviewsPage`

- [ ] **Step 2: Add reviews link to AdminLayout nav**

Add "评价管理" menu item with `MessageSquare` icon pointing to `/admin/reviews`.

- [ ] **Step 3: Update CustomerLayout nav**

Add "我的收藏" link next to "我的预订".

- [ ] **Step 4: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 13: Frontend — UI upgrade: HomePage, BookingPage, LoginPage, MyReservationsPage

**Files:**
- Modify: `frontend/src/pages/customer/HomePage.tsx`
- Modify: `frontend/src/pages/customer/BookingPage.tsx`
- Modify: `frontend/src/pages/customer/CustomerLoginPage.tsx`
- Modify: `frontend/src/pages/customer/MyReservationsPage.tsx`
- Modify: `frontend/src/lib/utils.ts` — add `formatDateFull`

- [ ] **Step 1: Add formatDateFull to utils.ts**

```ts
export function formatDateFull(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}
```

- [ ] **Step 2: Apply UI upgrades per spec**

For each page listed:
- Replace "加载中..." with `<Skeleton>` / `<CardSkeleton>` / `<DetailSkeleton>`
- Replace `window.confirm()` with `<ConfirmDialog>`
- Increase border radius from `rounded-lg/r` to `rounded-2xl`
- Increase button height to `h-11`
- Increase input height to `h-11`
- Add `rounded-xl` to inputs
- Add `focus:ring-2 focus:ring-amber-500` to inputs
- Add hover effects: cards `hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150`
- Add `active:scale-[0.98]` to primary buttons
- Add `<Breadcrumb>` to all detail/sub-pages

- [ ] **Step 3: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 14: Frontend — UI upgrade: Admin pages (Dashboard, Rooms, Reservations, CheckIns)

**Files:**
- Modify: `frontend/src/pages/admin/DashboardPage.tsx`
- Modify: `frontend/src/pages/admin/RoomsPage.tsx`
- Modify: `frontend/src/pages/admin/ReservationsPage.tsx`
- Modify: `frontend/src/pages/admin/CheckInsPage.tsx`

- [ ] **Step 1: Upgrade DashboardPage**

Add colored icons/trends to stat cards:
- 总房间: gray icon
- 可用房间: green check icon
- 已住: blue bed icon
- 维修中: orange wrench icon
- 已预订: purple calendar icon
- 待确认: amber clock icon

- [ ] **Step 2: Upgrade admin tables**

Add row hover highlight (`hover:bg-gray-50`). Add status badges with colored backgrounds.

- [ ] **Step 3: Add search/filter to RoomsPage**

Add search input (by room number) and filters (status, floor, room type) above the table.

- [ ] **Step 4: Verify frontend builds**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS

---

## Task 15: Full integration test

- [ ] **Step 1: Restart backend and verify new APIs**

Run backend. Test:
- `POST /api/reviews/rooms/1` (with auth) → create review
- `GET /api/reviews/rooms/1` → get room reviews
- `POST /api/favorites/1` (with auth) → add favorite
- `GET /api/favorites` (with auth) → list favorites
- `DELETE /api/favorites/1` → remove favorite
- `GET /api/rooms/available?checkIn=2026-06-15&checkOut=2026-06-17&sortBy=price&sortDir=asc&floor=3`

- [ ] **Step 2: Start frontend and verify pages**

Open browser and verify:
- Homepage renders with upgraded UI
- Room list page has sort/filter controls
- Room detail page shows reviews and favorite button
- My reservations page with tabs
- Reservation detail page `/my-reservations/:id`
- My favorites page `/my-favorites`
- Admin reviews page `/admin/reviews`

- [ ] **Step 3: Verify frontend builds clean**

Run: `cd frontend && npm run build`
Expected: BUILD SUCCESS