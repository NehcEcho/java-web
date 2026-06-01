package com.hotel.service;

import com.hotel.dto.audit.AuditLogResponse;
import com.hotel.entity.AuditLog;
import com.hotel.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public Page<AuditLogResponse> getLogs(String action, String username, LocalDateTime start, LocalDateTime end, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLog> logs;

        if (action != null && start != null && end != null) {
            logs = auditLogRepository.findByActionAndCreatedAtBetweenOrderByCreatedAtDesc(action, start, end, pageable);
        } else if (action != null) {
            logs = auditLogRepository.findByActionOrderByCreatedAtDesc(action, pageable);
        } else if (username != null) {
            logs = auditLogRepository.findByUsernameOrderByCreatedAtDesc(username, pageable);
        } else if (start != null && end != null) {
            logs = auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end, pageable);
        } else {
            logs = auditLogRepository.findByOrderByCreatedAtDesc(pageable);
        }

        return logs.map(this::toResponse);
    }

    private AuditLogResponse toResponse(AuditLog log) {
        AuditLogResponse response = new AuditLogResponse();
        response.setId(log.getId());
        response.setUsername(log.getUsername());
        response.setAction(log.getAction());
        response.setEntityType(log.getEntityType());
        response.setEntityId(log.getEntityId());
        response.setDetails(log.getDetails());
        response.setIpAddress(log.getIpAddress());
        response.setCreatedAt(log.getCreatedAt());
        return response;
    }
}
