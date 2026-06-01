package com.hotel.repository;

import com.hotel.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByOrderByCreatedAtDesc(Pageable pageable);
    Page<AuditLog> findByActionOrderByCreatedAtDesc(String action, Pageable pageable);
    Page<AuditLog> findByUsernameOrderByCreatedAtDesc(String username, Pageable pageable);
    Page<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AuditLog> findByActionAndCreatedAtBetweenOrderByCreatedAtDesc(String action, LocalDateTime start, LocalDateTime end, Pageable pageable);
}
