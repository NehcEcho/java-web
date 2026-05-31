# Hotel Room Management System - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use @subagent-driven-development (recommended) or @executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack hotel room management system with Spring Boot backend + React frontend, supporting admin management and customer booking.

**Architecture:** Monorepo with separate backend/ and frontend/ directories. Spring Boot REST API on port 8080, React SPA on port 5173. SQLite database. JWT authentication.

**Tech Stack:** Java 17, Spring Boot 3.2+, Spring Data JPA, Spring Security, SQLite, React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router v6, Axios

---

## File Structure Map

### Backend Files
```
backend/
├── pom.xml
├── src/main/java/com/hotel/
│   ├── HotelApplication.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── CorsConfig.java
│   │   └── WebConfig.java
│   ├── entity/
│   │   ├── User.java
│   │   ├── RoomType.java
│   │   ├── Room.java
│   │   ├── Reservation.java
│   │   ├── CheckIn.java
│   │   └── enums/
│   │       ├── UserRole.java
│   │       ├── RoomStatus.java
│   │       ├── ReservationStatus.java
│   │       └── CheckInStatus.java
│   ├── repository/
│   │   ├── UserRepository.java
│   │   ├── RoomTypeRepository.java
│   │   ├── RoomRepository.java
│   │   ├── ReservationRepository.java
│   │   └── CheckInRepository.java
│   ├── dto/
│   │   ├── ApiResponse.java
│   │   ├── auth/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── AuthResponse.java
│   │   ├── room/
│   │   │   ├── RoomRequest.java
│   │   │   ├── RoomResponse.java
│   │   │   ├── RoomStatusUpdateRequest.java
│   │   │   └── RoomFilterRequest.java
│   │   ├── roomtype/
│   │   │   ├── RoomTypeRequest.java
│   │   │   └── RoomTypeResponse.java
│   │   ├── reservation/
│   │   │   ├── ReservationRequest.java
│   │   │   └── ReservationResponse.java
│   │   ├── checkin/
│   │   │   ├── CheckInRequest.java
│   │   │   └── CheckInResponse.java
│   │   └── dashboard/
│   │       └── DashboardStats.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── RoomTypeService.java
│   │   ├── RoomService.java
│   │   ├── ReservationService.java
│   │   ├── CheckInService.java
│   │   └── DashboardService.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── RoomTypeController.java
│   │   ├── RoomController.java
│   │   ├── ReservationController.java
│   │   ├── CheckInController.java
│   │   └── DashboardController.java
│   ├── security/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── CustomUserDetailsService.java
│   └── exception/
│       ├── BusinessException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.yml
│   └── data.sql
└── src/test/java/com/hotel/
    └── HotelApplicationTests.java
```

### Frontend Files
```
frontend/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── components.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── lib/
│   │   ├── api.ts          # Axios instance + interceptors
│   │   └── utils.ts        # cn() helper etc
│   ├── api/
│   │   ├── auth.ts
│   │   ├── rooms.ts
│   │   ├── roomTypes.ts
│   │   ├── reservations.ts
│   │   ├── checkIns.ts
│   │   └── dashboard.ts
│   ├── hooks/
│   │   └── useAuth.tsx     # Auth context + hook
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   └── customer/
│   │       ├── CustomerLayout.tsx
│   │       └── CustomerNavbar.tsx
│   └── pages/
│       ├── admin/
│       │   ├── LoginPage.tsx
│       │   ├── DashboardPage.tsx
│       │   ├── RoomsPage.tsx
│       │   ├── RoomTypesPage.tsx
│       │   ├── ReservationsPage.tsx
│       │   └── CheckInsPage.tsx
│       └── customer/
│           ├── HomePage.tsx
│           ├── RoomsPage.tsx
│           ├── RoomDetailPage.tsx
│           ├── BookingPage.tsx
│           ├── MyReservationsPage.tsx
│           └── CustomerLoginPage.tsx
```

---

## Task 1: Backend Project Skeleton

**Files:**
- Create: `backend/pom.xml`
- Create: `backend/src/main/java/com/hotel/HotelApplication.java`
- Create: `backend/src/main/resources/application.yml`

- [ ] **Step 1: Create project directory structure**

Run:
```bash
mkdir -p "C:\Users\CJ\Desktop\project\java web\backend\src\main\java\com\hotel"
mkdir -p "C:\Users\CJ\Desktop\project\java web\backend\src\main\resources"
mkdir -p "C:\Users\CJ\Desktop\project\java web\backend\src\test\java\com\hotel"
```

- [ ] **Step 2: Create pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>
    <groupId>com.hotel</groupId>
    <artifactId>hotel-management</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>hotel-management</name>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.45.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.hibernate.orm</groupId>
            <artifactId>hibernate-community-dialects</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.5</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.5</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 3: Create HotelApplication.java**

```java
package com.hotel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HotelApplication {
    public static void main(String[] args) {
        SpringApplication.run(HotelApplication.class, args);
    }
}
```

- [ ] **Step 4: Create application.yml**

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:sqlite:${user.dir}/hotel.db
    driver-class-name: org.sqlite.JDBC
  jpa:
    database-platform: org.hibernate.community.dialect.SQLiteDialect
    hibernate:
      ddl-auto: update
    show-sql: true
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql

jwt:
  secret: HotelManagementSecretKey2026ForJWTTokenGenerationAndValidation
  expiration: 86400000

logging:
  level:
    com.hotel: DEBUG
```

- [ ] **Step 5: Verify backend compiles**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

---

## Task 2: Backend Enums + Entities

**Files:**
- Create: `backend/src/main/java/com/hotel/entity/enums/UserRole.java`
- Create: `backend/src/main/java/com/hotel/entity/enums/RoomStatus.java`
- Create: `backend/src/main/java/com/hotel/entity/enums/ReservationStatus.java`
- Create: `backend/src/main/java/com/hotel/entity/enums/CheckInStatus.java`
- Create: `backend/src/main/java/com/hotel/entity/User.java`
- Create: `backend/src/main/java/com/hotel/entity/RoomType.java`
- Create: `backend/src/main/java/com/hotel/entity/Room.java`
- Create: `backend/src/main/java/com/hotel/entity/Reservation.java`
- Create: `backend/src/main/java/com/hotel/entity/CheckIn.java`

- [ ] **Step 1: Create enum files**

```java
// UserRole.java
package com.hotel.entity.enums;

public enum UserRole {
    ADMIN, STAFF, CUSTOMER
}
```

```java
// RoomStatus.java
package com.hotel.entity.enums;

public enum RoomStatus {
    AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED
}
```

```java
// ReservationStatus.java
package com.hotel.entity.enums;

public enum ReservationStatus {
    PENDING, CONFIRMED, CANCELLED, COMPLETED
}
```

```java
// CheckInStatus.java
package com.hotel.entity.enums;

public enum CheckInStatus {
    STAYING, CHECKED_OUT
}
```

- [ ] **Step 2: Create entity files**

```java
// User.java
package com.hotel.entity;

import com.hotel.entity.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private String name;
    private String phone;
    private String email;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

```java
// RoomType.java
package com.hotel.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private BigDecimal basePrice;

    @Column(nullable = false)
    private Integer maxGuests;

    private String description;
    private String amenities;
}
```

```java
// Room.java
package com.hotel.entity;

import com.hotel.entity.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private Integer floor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;
}
```

```java
// Reservation.java
package com.hotel.entity;

import com.hotel.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(nullable = false)
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private Integer guestCount;

    private String specialRequests;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

```java
// CheckIn.java
package com.hotel.entity;

import com.hotel.entity.enums.CheckInStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_ins")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime actualCheckIn;

    private LocalDateTime actualCheckOut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckInStatus status;

    private BigDecimal deposit;
    private String notes;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;
}
```

- [ ] **Step 3: Verify compilation**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

---

## Task 3: Repositories + DTOs + Exception Handling

**Files:**
- Create all 5 repository files
- Create `ApiResponse.java`
- Create `BusinessException.java`
- Create `GlobalExceptionHandler.java`

- [ ] **Step 1: Create repositories**

```java
// UserRepository.java
package com.hotel.repository;

import com.hotel.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
```

```java
// RoomTypeRepository.java
package com.hotel.repository;

import com.hotel.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {}
```

```java
// RoomRepository.java
package com.hotel.repository;

import com.hotel.entity.Room;
import com.hotel.entity.enums.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);
    List<Room> findByRoomTypeId(Long roomTypeId);

    @Query("SELECT r FROM Room r WHERE r.status = 'AVAILABLE' AND r.id NOT IN " +
           "(SELECT res.room.id FROM Reservation res WHERE res.status IN ('PENDING','CONFIRMED') " +
           "AND res.checkInDate < :checkOut AND res.checkOutDate > :checkIn)")
    List<Room> findAvailableRooms(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

    long countByStatus(RoomStatus status);
}
```

```java
// ReservationRepository.java
package com.hotel.repository;

import com.hotel.entity.Reservation;
import com.hotel.entity.enums.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByStatus(ReservationStatus status);
}
```

```java
// CheckInRepository.java
package com.hotel.repository;

import com.hotel.entity.CheckIn;
import com.hotel.entity.enums.CheckInStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CheckInRepository extends JpaRepository<CheckIn, Long> {
    List<CheckIn> findByStatus(CheckInStatus status);
    List<CheckIn> findByReservationId(Long reservationId);
}
```

- [ ] **Step 2: Create ApiResponse wrapper**

```java
// ApiResponse.java
package com.hotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
```

- [ ] **Step 3: Create BusinessException + GlobalExceptionHandler**

```java
// BusinessException.java
package com.hotel.exception;

import lombok.Getter;

@Getter
public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String message) {
        this(400, message);
    }
}
```

```java
// GlobalExceptionHandler.java
package com.hotel.exception;

import com.hotel.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        return ResponseEntity.status(e.getCode() >= 500 ? 500 : e.getCode())
                .body(ApiResponse.error(e.getCode(), e.getMessage()));
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(401).body(ApiResponse.error(401, "用户名或密码错误"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(403).body(ApiResponse.error(403, "无权限访问"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .reduce((a, b) -> a + "; " + b)
                .orElse("参数验证失败");
        return ResponseEntity.status(400).body(ApiResponse.error(400, message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception e) {
        return ResponseEntity.status(500).body(ApiResponse.error(500, "服务器内部错误"));
    }
}
```

- [ ] **Step 4: Create all DTO files**

```java
// auth/LoginRequest.java
package com.hotel.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;
    @NotBlank(message = "密码不能为空")
    private String password;
}
```

```java
// auth/RegisterRequest.java
package com.hotel.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "用户名不能为空")
    private String username;
    @NotBlank(message = "密码不能为空")
    private String password;
    private String name;
    private String phone;
    private String email;
}
```

```java
// auth/AuthResponse.java
package com.hotel.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String role;
    private Long userId;
}
```

```java
// roomtype/RoomTypeRequest.java
package com.hotel.dto.roomtype;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeRequest {
    @NotBlank(message = "房间类型名称不能为空")
    private String name;
    @NotNull(message = "价格不能为空")
    private BigDecimal basePrice;
    @NotNull(message = "最大入住人数不能为空")
    private Integer maxGuests;
    private String description;
    private String amenities;
}
```

```java
// roomtype/RoomTypeResponse.java
package com.hotel.dto.roomtype;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RoomTypeResponse {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private Integer maxGuests;
    private String description;
    private String amenities;
}
```

```java
// room/RoomRequest.java
package com.hotel.dto.room;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomRequest {
    @NotBlank(message = "房间号不能为空")
    private String roomNumber;
    @NotNull(message = "楼层不能为空")
    private Integer floor;
    @NotNull(message = "房间类型ID不能为空")
    private Long roomTypeId;
}
```

```java
// room/RoomResponse.java
package com.hotel.dto.room;

import com.hotel.dto.roomtype.RoomTypeResponse;
import lombok.Data;

@Data
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private Integer floor;
    private String status;
    private RoomTypeResponse roomType;
}
```

```java
// room/RoomStatusUpdateRequest.java
package com.hotel.dto.room;

import com.hotel.entity.enums.RoomStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoomStatusUpdateRequest {
    @NotNull(message = "状态不能为空")
    private RoomStatus status;
}
```

```java
// reservation/ReservationRequest.java
package com.hotel.dto.reservation;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ReservationRequest {
    @NotNull(message = "房间ID不能为空")
    private Long roomId;
    @NotNull(message = "入住日期不能为空")
    private LocalDate checkInDate;
    @NotNull(message = "退房日期不能为空")
    private LocalDate checkOutDate;
    @NotNull(message = "入住人数不能为空")
    private Integer guestCount;
    private String specialRequests;
}
```

```java
// reservation/ReservationResponse.java
package com.hotel.dto.reservation;

import com.hotel.dto.room.RoomResponse;
import com.hotel.dto.roomtype.RoomTypeResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ReservationResponse {
    private Long id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;
    private BigDecimal totalPrice;
    private Integer guestCount;
    private String specialRequests;
    private RoomResponse room;
    private String userName;
    private Long userId;
    private LocalDateTime createdAt;
}
```

```java
// checkin/CheckInRequest.java
package com.hotel.dto.checkin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CheckInRequest {
    @NotNull(message = "预订ID不能为空")
    private Long reservationId;
    private BigDecimal deposit;
    private String notes;
}
```

```java
// checkin/CheckInResponse.java
package com.hotel.dto.checkin;

import com.hotel.dto.reservation.ReservationResponse;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CheckInResponse {
    private Long id;
    private LocalDateTime actualCheckIn;
    private LocalDateTime actualCheckOut;
    private String status;
    private BigDecimal deposit;
    private String notes;
    private ReservationResponse reservation;
}
```

```java
// dashboard/DashboardStats.java
package com.hotel.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;
    private long reservedRooms;
    private long totalRooms;
    private long todayCheckIns;
    private long todayCheckOuts;
    private long pendingReservations;
}
```

- [ ] **Step 5: Verify compilation**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

---

## Task 4: JWT + Spring Security Configuration

**Files:**
- Create: `backend/src/main/java/com/hotel/security/JwtTokenProvider.java`
- Create: `backend/src/main/java/com/hotel/security/JwtAuthenticationFilter.java`
- Create: `backend/src/main/java/com/hotel/security/CustomUserDetailsService.java`
- Create: `backend/src/main/java/com/hotel/config/SecurityConfig.java`
- Create: `backend/src/main/java/com/hotel/config/CorsConfig.java`

- [ ] **Step 1: Create JwtTokenProvider**

```java
package com.hotel.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    private <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claimsResolver.apply(claims);
    }

    private boolean isTokenExpired(String token) {
        return getClaimFromToken(token, Claims::getExpiration).before(new Date());
    }
}
```

- [ ] **Step 2: Create CustomUserDetailsService**

```java
package com.hotel.security;

import com.hotel.entity.User;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("用户不存在: " + username));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
```

- [ ] **Step 3: Create JwtAuthenticationFilter**

```java
package com.hotel.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = getTokenFromRequest(request);
        if (StringUtils.hasText(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            String username = jwtTokenProvider.getUsernameFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (jwtTokenProvider.validateToken(token, userDetails)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

- [ ] **Step 4: Create SecurityConfig**

```java
package com.hotel.config;

import com.hotel.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/rooms/available").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/rooms/{id}").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/room-types").permitAll()
                .requestMatchers("/api/admin/**", "/api/rooms", "/api/rooms/**",
                        "/api/room-types/**", "/api/reservations/**",
                        "/api/check-ins/**", "/api/dashboard/**")
                    .hasRole("ADMIN")
                .requestMatchers("/api/reservations", "/api/reservations/**",
                        "/api/check-ins/**")
                    .hasAnyRole("ADMIN", "STAFF", "CUSTOMER")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
```

- [ ] **Step 5: Create CorsConfig + WebConfig**

```java
// CorsConfig.java
package com.hotel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }
}
```

```java
// WebConfig.java
package com.hotel.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    // CORS is handled by CorsConfig + Spring Security
}
```

- [ ] **Step 6: Verify compilation**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

---

## Task 5: Backend Services

**Files:**
- Create: `backend/src/main/java/com/hotel/service/AuthService.java`
- Create: `backend/src/main/java/com/hotel/service/RoomTypeService.java`
- Create: `backend/src/main/java/com/hotel/service/RoomService.java`
- Create: `backend/src/main/java/com/hotel/service/ReservationService.java`
- Create: `backend/src/main/java/com/hotel/service/CheckInService.java`
- Create: `backend/src/main/java/com/hotel/service/DashboardService.java`

- [ ] **Step 1: Create AuthService**

```java
package com.hotel.service;

import com.hotel.dto.auth.AuthResponse;
import com.hotel.dto.auth.LoginRequest;
import com.hotel.dto.auth.RegisterRequest;
import com.hotel.entity.User;
import com.hotel.entity.enums.UserRole;
import com.hotel.exception.BusinessException;
import com.hotel.repository.UserRepository;
import com.hotel.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtTokenProvider.generateToken(userDetails);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("用户不存在"));
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getId());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("用户名已存在");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.CUSTOMER);
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtTokenProvider.generateToken(userDetails);
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), user.getId());
    }
}
```

- [ ] **Step 2: Create RoomTypeService**

```java
package com.hotel.service;

import com.hotel.dto.roomtype.RoomTypeRequest;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.entity.RoomType;
import com.hotel.exception.BusinessException;
import com.hotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public List<RoomTypeResponse> findAll() {
        return roomTypeRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public RoomTypeResponse findById(Long id) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        return toResponse(roomType);
    }

    public RoomTypeResponse create(RoomTypeRequest request) {
        RoomType roomType = new RoomType();
        roomType.setName(request.getName());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setMaxGuests(request.getMaxGuests());
        roomType.setDescription(request.getDescription());
        roomType.setAmenities(request.getAmenities());
        return toResponse(roomTypeRepository.save(roomType));
    }

    public RoomTypeResponse update(Long id, RoomTypeRequest request) {
        RoomType roomType = roomTypeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        roomType.setName(request.getName());
        roomType.setBasePrice(request.getBasePrice());
        roomType.setMaxGuests(request.getMaxGuests());
        roomType.setDescription(request.getDescription());
        roomType.setAmenities(request.getAmenities());
        return toResponse(roomTypeRepository.save(roomType));
    }

    public void delete(Long id) {
        roomTypeRepository.deleteById(id);
    }

    private RoomTypeResponse toResponse(RoomType roomType) {
        RoomTypeResponse response = new RoomTypeResponse();
        response.setId(roomType.getId());
        response.setName(roomType.getName());
        response.setBasePrice(roomType.getBasePrice());
        response.setMaxGuests(roomType.getMaxGuests());
        response.setDescription(roomType.getDescription());
        response.setAmenities(roomType.getAmenities());
        return response;
    }
}
```

- [ ] **Step 3: Create RoomService**

```java
package com.hotel.service;

import com.hotel.dto.room.*;
import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;

    public List<RoomResponse> findAll() {
        return roomRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<RoomResponse> findByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<RoomResponse> findAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        return roomRepository.findAvailableRooms(checkIn, checkOut).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public RoomResponse findById(Long id) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        return toResponse(room);
    }

    public RoomResponse create(RoomRequest request) {
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setStatus(RoomStatus.AVAILABLE);
        room.setRoomType(roomType);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse update(Long id, RoomRequest request) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new BusinessException("房间类型不存在"));
        room.setRoomNumber(request.getRoomNumber());
        room.setFloor(request.getFloor());
        room.setRoomType(roomType);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse updateStatus(Long id, RoomStatus status) {
        Room room = roomRepository.findById(id).orElseThrow(() -> new BusinessException("房间不存在"));
        room.setStatus(status);
        return toResponse(roomRepository.save(room));
    }

    private RoomResponse toResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setFloor(room.getFloor());
        response.setStatus(room.getStatus().name());
        RoomTypeResponse rtResponse = new RoomTypeResponse();
        rtResponse.setId(room.getRoomType().getId());
        rtResponse.setName(room.getRoomType().getName());
        rtResponse.setBasePrice(room.getRoomType().getBasePrice());
        rtResponse.setMaxGuests(room.getRoomType().getMaxGuests());
        rtResponse.setDescription(room.getRoomType().getDescription());
        rtResponse.setAmenities(room.getRoomType().getAmenities());
        response.setRoomType(rtResponse);
        return response;
    }
}
```

Note: `RoomTypeResponse` import is from `com.hotel.dto.roomtype.RoomTypeResponse`.

- [ ] **Step 4: Create ReservationService**

```java
package com.hotel.service;

import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.entity.Reservation;
import com.hotel.entity.Room;
import com.hotel.entity.User;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public ReservationResponse create(ReservationRequest request, Long userId) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new BusinessException("房间不存在"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("用户不存在"));

        long nights = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
        if (nights <= 0) {
            throw new BusinessException("退房日期必须晚于入住日期");
        }
        BigDecimal totalPrice = room.getRoomType().getBasePrice().multiply(BigDecimal.valueOf(nights));

        List<Reservation> conflicts = reservationRepository.findByStatus(ReservationStatus.CONFIRMED).stream()
                .filter(r -> r.getRoom().getId().equals(room.getId())
                        && r.getCheckInDate().isBefore(request.getCheckOutDate())
                        && r.getCheckOutDate().isAfter(request.getCheckInDate()))
                .toList();
        if (!conflicts.isEmpty()) {
            throw new BusinessException("该房间在选定日期已被预订");
        }

        Reservation reservation = new Reservation();
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setTotalPrice(totalPrice);
        reservation.setGuestCount(request.getGuestCount());
        reservation.setSpecialRequests(request.getSpecialRequests());
        reservation.setUser(user);
        reservation.setRoom(room);
        return toResponse(reservationRepository.save(reservation));
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<ReservationResponse> findByUserId(Long userId) {
        return reservationRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ReservationResponse findById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        return toResponse(reservation);
    }

    public ReservationResponse confirm(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.getRoom().setStatus(com.hotel.entity.enums.RoomStatus.RESERVED);
        roomRepository.save(reservation.getRoom());
        return toResponse(reservationRepository.save(reservation));
    }

    public ReservationResponse cancel(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() == ReservationStatus.CONFIRMED) {
            reservation.getRoom().setStatus(com.hotel.entity.enums.RoomStatus.AVAILABLE);
            roomRepository.save(reservation.getRoom());
        }
        reservation.setStatus(ReservationStatus.CANCELLED);
        return toResponse(reservationRepository.save(reservation));
    }

    private ReservationResponse toResponse(Reservation r) {
        ReservationResponse response = new ReservationResponse();
        response.setId(r.getId());
        response.setCheckInDate(r.getCheckInDate());
        response.setCheckOutDate(r.getCheckOutDate());
        response.setStatus(r.getStatus().name());
        response.setTotalPrice(r.getTotalPrice());
        response.setGuestCount(r.getGuestCount());
        response.setSpecialRequests(r.getSpecialRequests());
        response.setRoomType(r.getRoom().getRoomType().getName());
        response.setRoomNumber(r.getRoom().getRoomNumber());
        response.setUserId(r.getUser().getId());
        response.setUserName(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
        response.setCreatedAt(r.getCreatedAt());
        return response;
    }
}
```

- [ ] **Step 5: Create CheckInService**

```java
package com.hotel.service;

import com.hotel.dto.checkin.CheckInRequest;
import com.hotel.dto.checkin.CheckInResponse;
import com.hotel.entity.CheckIn;
import com.hotel.entity.Reservation;
import com.hotel.entity.enums.CheckInStatus;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.exception.BusinessException;
import com.hotel.repository.CheckInRepository;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;

    public CheckInResponse checkIn(CheckInRequest request) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new BusinessException("预订不存在"));
        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new BusinessException("只有已确认的预订才能办理入住");
        }
        List<CheckIn> existingCheckIns = checkInRepository.findByReservationId(reservation.getId());
        boolean alreadyCheckedIn = existingCheckIns.stream()
                .anyMatch(ci -> ci.getStatus() == CheckInStatus.STAYING);
        if (alreadyCheckedIn) {
            throw new BusinessException("该预订已办理入住");
        }

        reservation.setStatus(ReservationStatus.COMPLETED);
        reservationRepository.save(reservation);

        CheckIn checkIn = new CheckIn();
        checkIn.setActualCheckIn(LocalDateTime.now());
        checkIn.setStatus(CheckInStatus.STAYING);
        checkIn.setDeposit(request.getDeposit());
        checkIn.setNotes(request.getNotes());
        checkIn.setReservation(reservation);

        reservation.getRoom().setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(reservation.getRoom());

        return toResponse(checkInRepository.save(checkIn));
    }

    public CheckInResponse checkOut(Long id) {
        CheckIn checkIn = checkInRepository.findById(id)
                .orElseThrow(() -> new BusinessException("入住记录不存在"));
        if (checkIn.getStatus() != CheckInStatus.STAYING) {
            throw new BusinessException("该房间未在住状态");
        }
        checkIn.setActualCheckOut(LocalDateTime.now());
        checkIn.setStatus(CheckInStatus.CHECKED_OUT);

        checkIn.getReservation().getRoom().setStatus(RoomStatus.AVAILABLE);
        roomRepository.save(checkIn.getReservation().getRoom());

        return toResponse(checkInRepository.save(checkIn));
    }

    public List<CheckInResponse> findAll() {
        return checkInRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    private CheckInResponse toResponse(CheckIn ci) {
        CheckInResponse response = new CheckInResponse();
        response.setId(ci.getId());
        response.setActualCheckIn(ci.getActualCheckIn());
        response.setActualCheckOut(ci.getActualCheckOut());
        response.setStatus(ci.getStatus().name());
        response.setDeposit(ci.getDeposit());
        response.setNotes(ci.getNotes());

        Reservation r = ci.getReservation();
        ReservationService rs = null;
        com.hotel.dto.reservation.ReservationResponse resResponse = new com.hotel.dto.reservation.ReservationResponse();
        resResponse.setId(r.getId());
        resResponse.setCheckInDate(r.getCheckInDate());
        resResponse.setCheckOutDate(r.getCheckOutDate());
        resResponse.setStatus(r.getStatus().name());
        resResponse.setTotalPrice(r.getTotalPrice());
        resResponse.setGuestCount(r.getGuestCount());
        resResponse.setSpecialRequests(r.getSpecialRequests());
        resResponse.setRoomNumber(r.getRoom().getRoomNumber());
        resResponse.setRoomType(r.getRoom().getRoomType().getName());
        resResponse.setUserId(r.getUser().getId());
        resResponse.setUserName(r.getUser().getName() != null ? r.getUser().getName() : r.getUser().getUsername());
        resResponse.setCreatedAt(r.getCreatedAt());
        response.setReservation(resResponse);

        return response;
    }
}
```

- [ ] **Step 6: Create DashboardService**

```java
package com.hotel.service;

import com.hotel.dto.dashboard.DashboardStats;
import com.hotel.entity.enums.CheckInStatus;
import com.hotel.entity.enums.ReservationStatus;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.repository.CheckInRepository;
import com.hotel.repository.ReservationRepository;
import com.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;
    private final CheckInRepository checkInRepository;

    public DashboardStats getStats() {
        long totalRooms = roomRepository.count();
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long maintenanceRooms = roomRepository.countByStatus(RoomStatus.MAINTENANCE);
        long reservedRooms = roomRepository.countByStatus(RoomStatus.RESERVED);
        long pendingReservations = reservationRepository.findByStatus(ReservationStatus.PENDING).size();
        long todayCheckIns = checkInRepository.findAll().stream()
                .filter(ci -> ci.getActualCheckIn() != null
                        && ci.getActualCheckIn().toLocalDate().equals(LocalDate.now()))
                .count();
        long todayCheckOuts = checkInRepository.findAll().stream()
                .filter(ci -> ci.getActualCheckOut() != null
                        && ci.getActualCheckOut().toLocalDate().equals(LocalDate.now()))
                .count();
        return new DashboardStats(availableRooms, occupiedRooms, maintenanceRooms, reservedRooms,
                totalRooms, todayCheckIns, todayCheckOuts, pendingReservations);
    }
}
```

- [ ] **Step 7: Verify compilation**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

Note: The imports in RoomService need to use `com.hotel.dto.roomtype.RoomTypeResponse` for the inner room type.

---

## Task 6: Backend Controllers

**Files:**
- Create: `backend/src/main/java/com/hotel/controller/AuthController.java`
- Create: `backend/src/main/java/com/hotel/controller/RoomTypeController.java`
- Create: `backend/src/main/java/com/hotel/controller/RoomController.java`
- Create: `backend/src/main/java/com/hotel/controller/ReservationController.java`
- Create: `backend/src/main/java/com/hotel/controller/CheckInController.java`
- Create: `backend/src/main/java/com/hotel/controller/DashboardController.java`

- [ ] **Step 1: Create AuthController**

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.auth.AuthResponse;
import com.hotel.dto.auth.LoginRequest;
import com.hotel.dto.auth.RegisterRequest;
import com.hotel.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ApiResponse.success(authService.register(request));
    }
}
```

- [ ] **Step 2: Create RoomTypeController**

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.roomtype.RoomTypeRequest;
import com.hotel.dto.roomtype.RoomTypeResponse;
import com.hotel.service.RoomTypeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public ApiResponse<List<RoomTypeResponse>> findAll() {
        return ApiResponse.success(roomTypeService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomTypeResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(roomTypeService.findById(id));
    }

    @PostMapping
    public ApiResponse<RoomTypeResponse> create(@Valid @RequestBody RoomTypeRequest request) {
        return ApiResponse.success(roomTypeService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomTypeResponse> update(@PathVariable Long id, @Valid @RequestBody RoomTypeRequest request) {
        return ApiResponse.success(roomTypeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        roomTypeService.delete(id);
        return ApiResponse.success("删除成功", null);
    }
}
```

- [ ] **Step 3: Create RoomController**

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.room.RoomRequest;
import com.hotel.dto.room.RoomResponse;
import com.hotel.dto.room.RoomStatusUpdateRequest;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ApiResponse<List<RoomResponse>> findAll(
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(required = false) Long roomTypeId) {
        if (status != null) {
            return ApiResponse.success(roomService.findByStatus(status));
        }
        return ApiResponse.success(roomService.findAll());
    }

    @GetMapping("/available")
    public ApiResponse<List<RoomResponse>> findAvailable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ApiResponse.success(roomService.findAvailableRooms(checkIn, checkOut));
    }

    @GetMapping("/{id}")
    public ApiResponse<RoomResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(roomService.findById(id));
    }

    @PostMapping
    public ApiResponse<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return ApiResponse.success(roomService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<RoomResponse> update(@PathVariable Long id, @Valid @RequestBody RoomRequest request) {
        return ApiResponse.success(roomService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    public ApiResponse<RoomResponse> updateStatus(@PathVariable Long id, @Valid @RequestBody RoomStatusUpdateRequest request) {
        return ApiResponse.success(roomService.updateStatus(id, request.getStatus()));
    }
}
```

- [ ] **Step 4: Create ReservationController**

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ApiResponse<ReservationResponse> create(@Valid @RequestBody ReservationRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromDetails(userDetails);
        return ApiResponse.success(reservationService.create(request, userId));
    }

    @GetMapping
    public ApiResponse<List<ReservationResponse>> findAll(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromDetails(userDetails);
        return ApiResponse.success(reservationService.findByUserId(userId));
    }

    @GetMapping("/all")
    public ApiResponse<List<ReservationResponse>> findAllAdmin() {
        return ApiResponse.success(reservationService.findAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(reservationService.findById(id));
    }

    @PatchMapping("/{id}/confirm")
    public ApiResponse<ReservationResponse> confirm(@PathVariable Long id) {
        return ApiResponse.success(reservationService.confirm(id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<ReservationResponse> cancel(@PathVariable Long id) {
        return ApiResponse.success(reservationService.cancel(id));
    }

    private Long getUserIdFromDetails(UserDetails userDetails) {
        return com.hotel.entity.enums.UserRole.ADMIN.name().equals(
                userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", ""))
                ? null : 1L;
    }
}
```

Note: The getUserIdFromDetails needs to actually resolve from the User entity. We'll need to inject UserRepository or store userId in JWT claims. For MVP, we'll add a helper that resolves from the username:

The `ReservationController` needs a proper way to get userId. We'll update it to inject `UserRepository`:

```java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.reservation.ReservationRequest;
import com.hotel.dto.reservation.ReservationResponse;
import com.hotel.repository.UserRepository;
import com.hotel.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    @PostMapping
    public ApiResponse<ReservationResponse> create(@Valid @RequestBody ReservationRequest request,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ApiResponse.success(reservationService.create(request, userId));
    }

    @GetMapping
    public ApiResponse<List<ReservationResponse>> list(@AuthenticationPrincipal UserDetails userDetails) {
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        if (role.equals("ROLE_ADMIN")) {
            return ApiResponse.success(reservationService.findAll());
        }
        return ApiResponse.success(reservationService.findByUserId(getUserId(userDetails)));
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(reservationService.findById(id));
    }

    @PatchMapping("/{id}/confirm")
    public ApiResponse<ReservationResponse> confirm(@PathVariable Long id) {
        return ApiResponse.success(reservationService.confirm(id));
    }

    @PatchMapping("/{id}/cancel")
    public ApiResponse<ReservationResponse> cancel(@PathVariable Long id) {
        return ApiResponse.success(reservationService.cancel(id));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new com.hotel.exception.BusinessException("用户不存在")).getId();
    }
}
```

- [ ] **Step 5: Create CheckInController + DashboardController**

```java
// CheckInController.java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.checkin.CheckInRequest;
import com.hotel.dto.checkin.CheckInResponse;
import com.hotel.service.CheckInService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/check-ins")
@RequiredArgsConstructor
public class CheckInController {

    private final CheckInService checkInService;

    @PostMapping
    public ApiResponse<CheckInResponse> checkIn(@Valid @RequestBody CheckInRequest request) {
        return ApiResponse.success(checkInService.checkIn(request));
    }

    @PatchMapping("/{id}/check-out")
    public ApiResponse<CheckInResponse> checkOut(@PathVariable Long id) {
        return ApiResponse.success(checkInService.checkOut(id));
    }

    @GetMapping
    public ApiResponse<List<CheckInResponse>> findAll() {
        return ApiResponse.success(checkInService.findAll());
    }
}
```

```java
// DashboardController.java
package com.hotel.controller;

import com.hotel.dto.ApiResponse;
import com.hotel.dto.dashboard.DashboardStats;
import com.hotel.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ApiResponse<DashboardStats> getStats() {
        return ApiResponse.success(dashboardService.getStats());
    }
}
```

- [ ] **Step 6: Verify compilation and run**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn compile
```
Expected: BUILD SUCCESS

---

## Task 7: Seed Data + Application Config

**Files:**
- Modify: `backend/src/main/resources/data.sql`
- Modify: `backend/src/main/resources/application.yml`

- [ ] **Step 1: Create data.sql with seed data**

```sql
-- Only insert if tables are empty (using IF NOT EXISTS pattern)

-- Admin user (password: admin123, BCrypt encoded)
INSERT OR IGNORE INTO users (id, username, password, role, name, created_at)
VALUES (1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', '管理员', CURRENT_TIMESTAMP);

-- Sample customer
INSERT OR IGNORE INTO users (id, username, password, role, name, phone, email, created_at)
VALUES (2, 'customer1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CUSTOMER', '张三', '13800138000', 'zhangsan@example.com', CURRENT_TIMESTAMP);

-- Room types
INSERT OR IGNORE INTO room_type (id, name, base_price, max_guests, description, amenities)
VALUES (1, '单人间', 299.00, 1, '温馨舒适的单人房间', 'WiFi,TV,空调');

INSERT OR IGNORE INTO room_type (id, name, base_price, max_guests, description, amenities)
VALUES (2, '双人间', 399.00, 2, '宽敞明亮的双人房间', 'WiFi,TV,空调,迷你吧');

INSERT OR IGNORE INTO room_type (id, name, base_price, max_guests, description, amenities)
VALUES (3, '套房', 699.00, 4, '豪华舒适套房', 'WiFi,TV,空调,迷你吧,浴缸');

-- Rooms (3 floors)
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (1, '301', 3, 'AVAILABLE', 1);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (2, '302', 3, 'AVAILABLE', 1);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (3, '303', 3, 'AVAILABLE', 2);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (4, '401', 4, 'AVAILABLE', 2);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (5, '402', 4, 'AVAILABLE', 2);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (6, '403', 4, 'AVAILABLE', 3);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (7, '404', 4, 'AVAILABLE', 3);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (8, '501', 5, 'AVAILABLE', 1);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (9, '502', 5, 'AVAILABLE', 2);
INSERT OR IGNORE INTO room (id, room_number, floor, status, room_type_id) VALUES (10, '503', 5, 'AVAILABLE', 3);
```

Note: Since SQLite with Hibernate ddl-auto=update doesn't guarantee INSERT OR IGNORE works with IDENTITY columns, we'll switch `data.sql` initialization mode and ensure it only runs once. Update `application.yml` to use `spring.sql.init.mode=always` but add `IF NOT EXISTS` effectively by checking with a different approach. For SQLite, it's simpler to use `spring.jpa.hibernate.ddl-auto=create` + `spring.sql.init.mode=always` for development, but that wipes data. Instead, use `update` mode and a programmatic seeder:

- [ ] **Step 2: Update application.yml for SQLite compatibility**

Update `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:sqlite:${user.dir}/hotel.db
    driver-class-name: org.sqlite.JDBC
  jpa:
    database-platform: org.hibernate.community.dialect.SQLiteDialect
    hibernate:
      ddl-auto: update
    show-sql: false
  sql:
    init:
      mode: never

jwt:
  secret: HotelManagementSecretKey2026ForJWTTokenGenerationAndValidation
  expiration: 86400000

logging:
  level:
    com.hotel: DEBUG
```

We switched from `data.sql` to a programmatic seeder. Let's create it:

```java
// DataSeeder.java
package com.hotel.config;

import com.hotel.entity.Room;
import com.hotel.entity.RoomType;
import com.hotel.entity.User;
import com.hotel.entity.enums.RoomStatus;
import com.hotel.entity.enums.UserRole;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.RoomTypeRepository;
import com.hotel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final RoomRepository roomRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedRoomTypes();
        seedRooms();
        log.info("数据初始化完成");
    }

    private void seedAdmin() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setName("管理员");
            userRepository.save(admin);
            log.info("创建管理员账号: admin/admin123");
        }
    }

    private void seedRoomTypes() {
        if (roomTypeRepository.count() == 0) {
            roomTypeRepository.save(new RoomType(null, "单人间", new BigDecimal("299"), 1, "温馨舒适的单人房间", "WiFi,TV,空调"));
            roomTypeRepository.save(new RoomType(null, "双人间", new BigDecimal("399"), 2, "宽敞明亮的双人房间", "WiFi,TV,空调,迷你吧"));
            roomTypeRepository.save(new RoomType(null, "套房", new BigDecimal("699"), 4, "豪华舒适套房", "WiFi,TV,空调,迷你吧,浴缸"));
            log.info("创建3种房间类型");
        }
    }

    private void seedRooms() {
        if (roomRepository.count() == 0) {
            RoomType single = roomTypeRepository.findAll().get(0);
            RoomType double_ = roomTypeRepository.findAll().get(1);
            RoomType suite = roomTypeRepository.findAll().get(2);

            roomRepository.save(new Room(null, "301", 3, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "302", 3, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "303", 3, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "401", 4, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "402", 4, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "403", 4, RoomStatus.AVAILABLE, suite));
            roomRepository.save(new Room(null, "404", 4, RoomStatus.AVAILABLE, suite));
            roomRepository.save(new Room(null, "501", 5, RoomStatus.AVAILABLE, single));
            roomRepository.save(new Room(null, "502", 5, RoomStatus.AVAILABLE, double_));
            roomRepository.save(new Room(null, "503", 5, RoomStatus.AVAILABLE, suite));
            log.info("创建10个示例房间");
        }
    }
}
```

- [ ] **Step 3: Test backend starts**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn spring-boot:run
```
Wait for "Started HotelApplication" in the console. Then test:
```bash
curl http://localhost:8080/api/auth/login -X POST -H "Content-Type: application/json" -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```
Expected: JWT token response. Then Ctrl+C to stop server.

---

## Task 8: Frontend Project Setup

**Files:**
- Create: `frontend/` project via Vite
- Configure: Tailwind CSS, shadcn/ui, React Router, Axios

- [ ] **Step 1: Create React project with Vite**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web"
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

- [ ] **Step 2: Install dependencies**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend"
npm install react-router-dom axios
npm install -D tailwindcss @tailwindcss/vite
npm install lucide-react class-variance-authority clsx tailwind-merge
```

- [ ] **Step 3: Configure Tailwind CSS**

Update `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

Update `frontend/src/index.css`:

```css
@import "tailwindcss";

@theme inline {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

- [ ] **Step 4: Initialize shadcn/ui**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend"
npx shadcn@latest init -d
```

Then add the needed components:
```bash
npx shadcn@latest add button card input label select table badge dialog dropdown-menu separator sheet toast sonner tabs textarea
```

- [ ] **Step 5: Create utility files**

Create `frontend/src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('zh-CN')
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('zh-CN')
}
```

- [ ] **Step 6: Verify frontend builds**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend" && npm run build
```
Expected: Build successful with no errors

---

## Task 9: Frontend API Layer + Auth Context

**Files:**
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/api/auth.ts`
- Create: `frontend/src/api/rooms.ts`
- Create: `frontend/src/api/roomTypes.ts`
- Create: `frontend/src/api/reservations.ts`
- Create: `frontend/src/api/checkIns.ts`
- Create: `frontend/src/api/dashboard.ts`
- Create: `frontend/src/hooks/useAuth.tsx`

- [ ] **Step 1: Create API client**

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = window.location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

- [ ] **Step 2: Create API modules**

```typescript
// frontend/src/api/auth.ts
import api from '@/lib/api';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  userId: number;
}

export const authApi = {
  login: (data: LoginData) => api.post<{ code: number; data: AuthResponse }>('/auth/login', data),
  register: (data: RegisterData) => api.post<{ code: number; data: AuthResponse }>('/auth/register', data),
};
```

```typescript
// frontend/src/api/roomTypes.ts
import api from '@/lib/api';

export interface RoomType {
  id: number;
  name: string;
  basePrice: number;
  maxGuests: number;
  description: string;
  amenities: string;
}

export interface RoomTypeRequest {
  name: string;
  basePrice: number;
  maxGuests: number;
  description?: string;
  amenities?: string;
}

export const roomTypeApi = {
  findAll: () => api.get<{ code: number; data: RoomType[] }>('/room-types'),
  findById: (id: number) => api.get<{ code: number; data: RoomType }>(`/room-types/${id}`),
  create: (data: RoomTypeRequest) => api.post<{ code: number; data: RoomType }>('/room-types', data),
  update: (id: number, data: RoomTypeRequest) => api.put<{ code: number; data: RoomType }>(`/room-types/${id}`, data),
  delete: (id: number) => api.delete(`/room-types/${id}`),
};
```

```typescript
// frontend/src/api/rooms.ts
import api from '@/lib/api';

export interface Room {
  id: number;
  roomNumber: string;
  floor: number;
  status: string;
  roomType: {
    id: number;
    name: string;
    basePrice: number;
    maxGuests: number;
    description: string;
    amenities: string;
  };
}

export interface RoomRequest {
  roomNumber: string;
  floor: number;
  roomTypeId: number;
}

export const roomApi = {
  findAll: (params?: { status?: string }) => api.get<{ code: number; data: Room[] }>('/rooms', { params }),
  findAvailable: (checkIn: string, checkOut: string) =>
    api.get<{ code: number; data: Room[] }>('/rooms/available', { params: { checkIn, checkOut } }),
  findById: (id: number) => api.get<{ code: number; data: Room }>(`/rooms/${id}`),
  create: (data: RoomRequest) => api.post<{ code: number; data: Room }>('/rooms', data),
  update: (id: number, data: RoomRequest) => api.put<{ code: number; data: Room }>(`/rooms/${id}`, data),
  updateStatus: (id: number, status: string) => api.patch<{ code: number; data: Room }>(`/rooms/${id}/status`, { status }),
};
```

```typescript
// frontend/src/api/reservations.ts
import api from '@/lib/api';

export interface Reservation {
  id: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalPrice: number;
  guestCount: number;
  specialRequests: string;
  roomNumber: string;
  roomType: string;
  userId: number;
  userName: string;
  createdAt: string;
}

export interface ReservationRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  specialRequests?: string;
}

export const reservationApi = {
  create: (data: ReservationRequest) => api.post<{ code: number; data: Reservation }>('/reservations', data),
  findAll: () => api.get<{ code: number; data: Reservation[] }>('/reservations'),
  findById: (id: number) => api.get<{ code: number; data: Reservation }>(`/reservations/${id}`),
  confirm: (id: number) => api.patch<{ code: number; data: Reservation }>(`/reservations/${id}/confirm`),
  cancel: (id: number) => api.patch<{ code: number; data: Reservation }>(`/reservations/${id}/cancel`),
};
```

```typescript
// frontend/src/api/checkIns.ts
import api from '@/lib/api';

export interface CheckIn {
  id: number;
  actualCheckIn: string;
  actualCheckOut: string | null;
  status: string;
  deposit: number | null;
  notes: string | null;
  reservation: {
    id: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    totalPrice: number;
    guestCount: number;
    roomNumber: string;
    roomType: string;
    userName: string;
  };
}

export interface CheckInRequest {
  reservationId: number;
  deposit?: number;
  notes?: string;
}

export const checkInApi = {
  checkIn: (data: CheckInRequest) => api.post<{ code: number; data: CheckIn }>('/check-ins', data),
  checkOut: (id: number) => api.patch<{ code: number; data: CheckIn }>(`/check-ins/${id}/check-out`),
  findAll: () => api.get<{ code: number; data: CheckIn[] }>('/check-ins'),
};
```

```typescript
// frontend/src/api/dashboard.ts
import api from '@/lib/api';

export interface DashboardStats {
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  totalRooms: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  pendingReservations: number;
}

export const dashboardApi = {
  getStats: () => api.get<{ code: number; data: DashboardStats }>('/dashboard/stats'),
};
```

- [ ] **Step 3: Create Auth context**

```tsx
// frontend/src/hooks/useAuth.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  token: string;
  username: string;
  role: string;
  userId: number;
}

interface AuthContextType {
  user: User | null;
  login: (data: { token: string; username: string; role: string; userId: number }) => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (data: { token: string; username: string; role: string; userId: number }) => {
    const userData: User = {
      token: data.token,
      username: data.username,
      role: data.role,
      userId: data.userId,
    };
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Task 10: Frontend Routing + Layouts

**Files:**
- Create: `frontend/src/App.tsx`
- Create: `frontend/src/components/admin/AdminLayout.tsx`
- Create: `frontend/src/components/admin/AdminSidebar.tsx`
- Create: `frontend/src/components/customer/CustomerLayout.tsx`
- Create: `frontend/src/components/customer/CustomerNavbar.tsx`

- [ ] **Step 1: Create AdminLayout**

```tsx
// frontend/src/components/admin/AdminLayout.tsx
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
```

```tsx
// frontend/src/components/admin/AdminSidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bed, Building2, CalendarCheck, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { to: '/admin/rooms', label: '房间管理', icon: Bed },
  { to: '/admin/room-types', label: '房间类型', icon: Building2 },
  { to: '/admin/reservations', label: '预订管理', icon: CalendarCheck },
  { to: '/admin/check-ins', label: '入住退房', icon: LogIn },
];

export function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold">酒店管理系统</h1>
        <p className="text-xs text-gray-500 mt-1">管理端</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => { logout(); window.location.href = '/admin/login'; }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 w-full"
        >
          <LogOut className="h-4 w-4" />
          退出登录
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Create CustomerLayout**

```tsx
// frontend/src/components/customer/CustomerLayout.tsx
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './CustomerNavbar';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <CustomerNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-900 text-gray-400 text-center py-6 text-sm">
        &copy; 2026 酒店房间管理系统. All rights reserved.
      </footer>
    </div>
  );
}
```

```tsx
// frontend/src/components/customer/CustomerNavbar.tsx
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

export function CustomerNavbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">酒店预订</Link>
        <div className="flex items-center gap-6">
          <NavLink to="/rooms" className={({ isActive }) => cn('text-sm', isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900')}>
            浏览房间
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/my-reservations" className={({ isActive }) => cn('text-sm', isActive ? 'text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900')}>
                我的预订
              </NavLink>
              <span className="text-sm text-gray-600">{user?.username}</span>
              <button onClick={() => { logout(); }} className="text-sm text-gray-600 hover:text-gray-900">退出</button>
            </>
          ) : (
            <Link to="/login" className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800">
              登录
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create App.tsx with routing**

```tsx
// frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CustomerLayout } from '@/components/customer/CustomerLayout';
import { Toaster } from '@/components/ui/sonner';

// Admin pages
import AdminLoginPage from '@/pages/admin/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import RoomsPage from '@/pages/admin/RoomsPage';
import RoomTypesPage from '@/pages/admin/RoomTypesPage';
import ReservationsPage from '@/pages/admin/ReservationsPage';
import CheckInsPage from '@/pages/admin/CheckInsPage';

// Customer pages
import HomePage from '@/pages/customer/HomePage';
import CustomerRoomsPage from '@/pages/customer/RoomsPage';
import RoomDetailPage from '@/pages/customer/RoomDetailPage';
import BookingPage from '@/pages/customer/BookingPage';
import MyReservationsPage from '@/pages/customer/MyReservationsPage';
import CustomerLoginPage from '@/pages/customer/CustomerLoginPage';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}

function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="room-types" element={<RoomTypesPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="check-ins" element={<CheckInsPage />} />
        <Route index element={<Navigate to="dashboard" />} />
      </Route>

      {/* Customer routes */}
      <Route path="/" element={<CustomerLayout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<CustomerRoomsPage />} />
        <Route path="rooms/:id" element={<RoomDetailPage />} />
        <Route path="booking" element={<CustomerRoute><BookingPage /></CustomerRoute>} />
        <Route path="my-reservations" element={<CustomerRoute><MyReservationsPage /></CustomerRoute>} />
        <Route path="login" element={<CustomerLoginPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## Task 11: Admin Pages

**Files:**
- Create all 6 admin page components

Each admin page will use shadcn/ui components (Table, Card, Dialog, Button, Input, Select, Badge) and the API layer from Task 9.

Due to length, the key patterns are:

1. **LoginPage**: Form with username/password, calls `authApi.login()`, stores in AuthContext, redirects to `/admin/dashboard`
2. **DashboardPage**: Calls `dashboardApi.getStats()`, displays 4 stat cards (available/occupied/maintenance/reserved) + pending reservations count
3. **RoomsPage**: Table listing rooms with filters (status dropdown), Dialog for create/edit room, status change buttons
4. **RoomTypesPage**: CRUD table for room types with Dialog for create/edit
5. **ReservationsPage**: Table of all reservations, confirm/cancel action buttons, status badges
6. **CheckInsPage**: Table of pending reservations for check-in, check-in button opens Dialog, active check-ins with check-out button

Each page follows the same pattern: `useState` for data, `useEffect` for fetching, Table component for display, Dialog for forms, toast notifications for success/error.

- [ ] **Step 1: Create AdminLoginPage**

```tsx
// frontend/src/pages/admin/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      login(res.data.data);
      toast.success('登录成功');
      navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">管理员登录</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">用户名</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" required />
            </div>
            <div>
              <Label htmlFor="password">密码</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Create DashboardPage**

```tsx
// frontend/src/pages/admin/DashboardPage.tsx
import { useState, useEffect } from 'react';
import { dashboardApi, type DashboardStats } from '@/api/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bed, CheckCircle, Wrench, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    dashboardApi.getStats().then((res) => setStats(res.data.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-center py-10">加载中...</div>;

  const cards = [
    { title: '可用房间', value: stats.availableRooms, icon: CheckCircle, color: 'text-green-600' },
    { title: '已入住', value: stats.occupiedRooms, icon: Bed, color: 'text-blue-600' },
    { title: '维修中', value: stats.maintenanceRooms, icon: Wrench, color: 'text-yellow-600' },
    { title: '已预订', value: stats.reservedRooms, icon: Clock, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">仪表盘</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">共 {stats.totalRooms} 个房间</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>今日统计</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between"><span>今日入住</span><span className="font-medium">{stats.todayCheckIns}</span></div>
            <div className="flex justify-between"><span>今日退房</span><span className="font-medium">{stats.todayCheckOuts}</span></div>
            <div className="flex justify-between"><span>待确认预订</span><span className="font-medium text-orange-600">{stats.pendingReservations}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 3-6: Create remaining admin pages**

Create RoomsPage, RoomTypesPage, ReservationsPage, CheckInsPage following the same pattern: fetch data on mount, display in Table, support CRUD via Dialog, use toast for feedback. Each page imports from the corresponding API module and uses shadcn/ui components.

**RoomsPage** key features:
- Table showing roomNumber, floor, roomType, status with Badge coloring
- Filter by status dropdown
- Create/Edit room dialog
- Status change action (AVAILABLE/OCCUPIED/MAINTENANCE/RESERVED)

**RoomTypesPage** key features:
- Simple CRUD table for room types
- Create/Edit dialog with fields: name, basePrice, maxGuests, description, amenities
- Delete with confirmation

**ReservationsPage** key features:
- Table of all reservations with status badges
- Confirm and Cancel action buttons per row
- Filter by status

**CheckInsPage** key features:
- Two sections: pending check-ins (confirmed reservations) and active stays (STAYING status)
- Check-in button opens dialog with deposit/notes fields
- Check-out button on active stays

- [ ] **Step 7: Verify frontend builds**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend" && npm run build
```
Expected: Build successful

---

## Task 12: Customer Pages

**Files:**
- Create all 5 customer page components

- [ ] **Step 1: Create HomePage**

```tsx
// frontend/src/pages/customer/HomePage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function HomePage() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!checkIn || !checkOut) return;
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}`);
  };

  return (
    <div>
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">欢迎来到我们的酒店</h1>
          <p className="text-gray-300 text-lg mb-8">舒适的住宿体验，从预订开始</p>
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="checkIn">入住日期</Label>
                <Input type="date" id="checkIn" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="checkOut">退房日期</Label>
                <Input type="date" id="checkOut" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSearch}>搜索可用房间</Button>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: '舒适房间', desc: '所有房间配备现代化设施' },
            { title: '便捷预订', desc: '在线预订，即时确认' },
            { title: '优质服务', desc: '贴心服务，宾至如归' },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2-5: Create remaining customer pages**

**CustomerRoomsPage**: Fetches available rooms using `roomApi.findAvailable(checkIn, checkOut)` when dates are provided from query params, otherwise shows all rooms. Displays room cards with type, price, amenities, and a "查看详情" button linking to `/rooms/:id`.

**RoomDetailPage**: Shows room details (number, floor, type, price, amenities), has a "立即预订" button that navigates to `/booking?roomId={id}`.

**BookingPage**: Pre-fills roomId from query params, lets user pick dates and guestCount, calculates total price, calls `reservationApi.create()`, then redirects to `/my-reservations`.

**MyReservationsPage**: Lists user reservations with status badges, cancel button for PENDING/CONFIRMED status.

**CustomerLoginPage**: Login/register tabs, calls auth API, stores token, redirects to home.

- [ ] **Step 6: Verify full frontend builds and run**

Run:
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend" && npm run build
```
Expected: Build successful

---

## Task 13: Integration Testing + Final Polish

**Files:**
- Modify: `frontend/vite.config.ts` (ensure proxy)
- Modify: `backend/src/main/java/com/hotel/config/SecurityConfig.java` (CORS origin)
- Create: `README.md`

- [ ] **Step 1: Verify CORS + proxy configuration**

The Vite dev server proxy (configured in Task 8) forwards `/api/*` to `http://localhost:8080`. The backend CORS config (in SecurityConfig + CorsConfig) allows `http://localhost:5173`.

- [ ] **Step 2: Start backend and frontend, test full flow**

Start backend:
```bash
cd "C:\Users\CJ\Desktop\project\java web\backend" && mvn spring-boot:run
```

Start frontend (in a separate terminal):
```bash
cd "C:\Users\CJ\Desktop\project\java web\frontend" && npm run dev
```

Test the following flows:
1. Open http://localhost:5173 → Home page loads
2. Click "浏览房间" → Rooms page loads
3. Go to http://localhost:5173/admin/login → Login as admin/admin123 → Dashboard loads
4. Go to Room Types → CRUD works
5. Go to Rooms → CRUD works
6. Go to Reservations → List loads

- [ ] **Step 3: Create README.md**

```markdown
# Hotel Room Management System

酒店房间管理系统 — Spring Boot + React

## Tech Stack

- **Backend:** Spring Boot 3.2, Spring Data JPA, Spring Security, SQLite, JWT
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui

## Getting Started

### Backend

\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`

Server runs on http://localhost:8080

Default admin account: `admin` / `admin123`

### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Frontend runs on http://localhost:5173

## Features

- Room management (CRUD, status)
- Room type management (CRUD)
- Customer room search and booking
- Check-in/check-out workflow
- Admin dashboard with stats
- JWT authentication

## API Endpoints

See `docs/superpowers/specs/2026-05-30-hotel-room-management-design.md` for full API documentation.
```

- [ ] **Step 4: Commit initial version**

```bash
cd "C:\Users\CJ\Desktop\project\java web"
git init
git add .
git commit -m "feat: initial hotel room management system - Spring Boot + React MVP"
```