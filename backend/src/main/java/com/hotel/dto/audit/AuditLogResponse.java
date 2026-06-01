package com.hotel.dto.audit;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AuditLogResponse {
    private Long id;
    private String username;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String ipAddress;
    private LocalDateTime createdAt;
}
