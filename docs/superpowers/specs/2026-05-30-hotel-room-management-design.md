# Hotel Room Management System - Design Spec

## Overview

A hotel room management system with dual-facing interfaces: an admin panel for hotel staff to manage rooms, reservations, and check-ins/check-outs, and a customer-facing interface for browsing rooms and booking online.

**Tech Stack:** Spring Boot 3.2+ (Java 17) + React 18 (TypeScript + Vite) + Tailwind CSS + shadcn/ui + SQLite

**Scope:** MVP — core CRUD flows working, no payment, no image upload, no email notifications, no i18n.

---

## Architecture

**Pattern:** Monorepo, front/back separated, REST API communication.

```
hotel-management/
├── backend/                        # Spring Boot 3.2+ (Java 17)
│   ├── src/main/java/com/hotel/
│   │   ├── controller/            # REST API controllers
│   │   ├── service/               # Business logic
│   │   ├── repository/            # JPA repositories
│   │   ├── entity/                # JPA entities
│   │   ├── dto/                   # Request/Response DTOs
│   │   ├── config/                # Security, CORS, global config
│   │   └── HotelApplication.java
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   └── data.sql               # Seed data
│   └── pom.xml
├── frontend/                       # React 18 + TypeScript + Vite
│   ├── src/
│   │   ├── pages/admin/            # Admin pages
│   │   ├── pages/customer/         # Customer pages
│   │   ├── components/             # Shared + shadcn/ui components
│   │   ├── api/                    # Axios API modules
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/                    # Utilities
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

**Dev ports:** Backend 8080, Frontend 5173. CORS configured for development.

**Auth:** Spring Security + JWT (24h expiry). Route guards on both admin and customer protected routes.

---

## Data Model

### User
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-generated |
| username | String | Unique, not null |
| password | String | BCrypt hashed |
| role | Enum | ADMIN, STAFF, CUSTOMER |
| name | String | Display name |
| phone | String | Optional |
| email | String | Optional |
| createdAt | LocalDateTime | Auto-set |

### RoomType
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-generated |
| name | String | e.g. "单人间", "双人间", "套房" |
| basePrice | BigDecimal | Price per night |
| maxGuests | Integer | Max occupancy |
| description | String | Text description |
| amenities | String | Comma-separated, e.g. "WiFi,TV,Mini-bar" |

### Room
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-generated |
| roomNumber | String | Unique, e.g. "301" |
| floor | Integer | Floor number |
| status | Enum | AVAILABLE, OCCUPIED, MAINTENANCE, RESERVED |
| roomType | ManyToOne → RoomType | Foreign key |

### Reservation
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-generated |
| checkInDate | LocalDate | Planned check-in |
| checkOutDate | LocalDate | Planned check-out |
| status | Enum | PENDING, CONFIRMED, CANCELLED, COMPLETED |
| totalPrice | BigDecimal | Auto-calculated: nights × basePrice |
| guestCount | Integer | Number of guests |
| specialRequests | String | Optional |
| user | ManyToOne → User | Booked by |
| room | ManyToOne → Room | Booked room |
| createdAt | LocalDateTime | Auto-set |

### CheckIn
| Field | Type | Notes |
|---|---|---|
| id | Long (PK) | Auto-generated |
| actualCheckIn | LocalDateTime | Actual check-in time |
| actualCheckOut | LocalDateTime | Nullable, set on check-out |
| status | Enum | STAYING, CHECKED_OUT |
| deposit | BigDecimal | Deposit paid |
| notes | String | Optional |
| reservation | OneToOne → Reservation | Linked reservation |

**Relationships:** Room → RoomType (N:1), Reservation → User (N:1), Reservation → Room (N:1), CheckIn → Reservation (1:1)

---

## API Design

Base path: `/api`

### Authentication
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/register` | Customer self-registration |

### Room Types (Admin)
| Method | Path | Description |
|---|---|---|
| GET | `/api/room-types` | List all room types |
| POST | `/api/room-types` | Create room type (Admin) |
| PUT | `/api/room-types/{id}` | Update room type (Admin) |
| DELETE | `/api/room-types/{id}` | Delete room type (Admin) |

### Rooms (Admin + Customer)
| Method | Path | Description |
|---|---|---|
| GET | `/api/rooms` | List rooms (filter by status/type) |
| GET | `/api/rooms/available?checkIn=&checkOut=` | Search available rooms |
| GET | `/api/rooms/{id}` | Room detail |
| POST | `/api/rooms` | Create room (Admin) |
| PUT | `/api/rooms/{id}` | Update room (Admin) |
| PATCH | `/api/rooms/{id}/status` | Change room status (Admin) |

### Reservations
| Method | Path | Description |
|---|---|---|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations` | My reservations (Customer) / All (Admin) |
| GET | `/api/reservations/{id}` | Reservation detail |
| PATCH | `/api/reservations/{id}/cancel` | Cancel reservation |
| PATCH | `/api/reservations/{id}/confirm` | Confirm reservation (Admin) |

### Check-in / Check-out
| Method | Path | Description |
|---|---|---|
| POST | `/api/check-ins` | Process check-in |
| PATCH | `/api/check-ins/{id}/check-out` | Process check-out |
| GET | `/api/check-ins` | Check-in records |

### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/api/dashboard/stats` | Summary statistics |

**Standard response format:**
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

**Error response format:**
```json
{
  "code": 400,
  "message": "Room not available for selected dates",
  "data": null
}
```

---

## Frontend Pages

### Admin Pages (/admin)
| Route | Page | Key Features |
|---|---|---|
| `/admin/login` | Admin Login | Username/password form |
| `/admin/dashboard` | Dashboard | Stats cards (available/occupied/maintenance), today's check-ins/check-outs |
| `/admin/rooms` | Room Management | Table with filters, CRUD, status toggle |
| `/admin/room-types` | Room Type Management | CRUD for room types |
| `/admin/reservations` | Reservation Management | All reservations list, confirm/cancel actions |
| `/admin/check-ins` | Check-in/Check-out | Process check-in from reservation, check-out with summary |

**Admin layout:** Left sidebar navigation + top title bar + scrollable content area.

### Customer Pages (/)
| Route | Page | Key Features |
|---|---|---|
| `/` | Home | Hotel intro, search bar (dates + guest count) |
| `/rooms` | Room Browsing | Available rooms by date, type filter cards |
| `/rooms/:id` | Room Detail | Room info, amenities list, booking button |
| `/booking` | Booking Form | Guest details, date selection, price calculation, confirm |
| `/my-reservations` | My Reservations | Reservation list, status badges, cancel option |
| `/login` | Customer Login | Login/register tabs |

**Customer layout:** Top navbar (Logo + nav links + login button) + content + footer.

---

## Authentication & Authorization

- JWT token in Authorization header (Bearer)
- Token expiry: 24 hours
- Password hashing: BCrypt
- Admin routes require role=ADMIN
- Customer protected routes require authenticated user
- Public routes: Home, Room browsing, Room detail, Login/Register

---

## Error Handling

**Backend:**
- `@RestControllerAdvice` catches all exceptions
- Custom `BusinessException` for domain errors (e.g. "Room not available")
- Returns standard `{code, message, data}` format
- 401 for unauthorized, 403 for forbidden, 404 for not found

**Frontend:**
- Axios interceptor: 401 → redirect to login, 4xx/5xx → Toast notification
- Form validation on client side before API calls
- Loading states on all async operations

---

## Data Initialization

`data.sql` seeds on first startup:
- 1 admin account (admin/admin123)
- 3 room types: 单人间(¥299/night), 双人间(¥399/night), 套房(¥699/night)
- 10 sample rooms across 3 floors (3F: 301-303, 4F: 401-404, 5F: 501-503)

---

## MVP Scope Boundaries

**Included:**
- Room CRUD with status management
- Room type management
- Customer room search and booking
- Check-in/check-out workflow
- Admin dashboard with basic stats
- JWT authentication
- Responsive UI (mobile-friendly)

**Explicitly excluded:**
- Payment integration
- Image upload for rooms
- Email/SMS notifications
- Multi-language (i18n)
- Role granularity beyond ADMIN (STAFF/CUSTOMER distinctions deferred)
- Reporting/export
- Audit logging