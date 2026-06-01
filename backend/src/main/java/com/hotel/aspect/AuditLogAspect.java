package com.hotel.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotel.entity.AuditLog;
import com.hotel.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    @Around("@annotation(org.springframework.web.bind.annotation.PostMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PutMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.DeleteMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PatchMapping)")
    public Object logAudit(ProceedingJoinPoint joinPoint) throws Throwable {
        String username = getCurrentUsername();
        String action = getAction(joinPoint);
        String entityType = getEntityType(joinPoint);
        Long entityId = getEntityId(joinPoint);

        Object result = joinPoint.proceed();

        try {
            AuditLog auditLog = new AuditLog();
            auditLog.setUsername(username);
            auditLog.setAction(action);
            auditLog.setEntityType(entityType);
            auditLog.setEntityId(entityId);
            auditLog.setIpAddress(getClientIp());

            try {
                auditLog.setDetails(objectMapper.writeValueAsString(result));
            } catch (Exception e) {
                auditLog.setDetails("无法序列化响应");
            }

            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            log.error("记录审计日志失败", e);
        }

        return result;
    }

    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getName();
        }
        return "anonymous";
    }

    private String getAction(ProceedingJoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        if (methodName.startsWith("create") || methodName.startsWith("add") || methodName.startsWith("register")) return "CREATE";
        if (methodName.startsWith("update") || methodName.startsWith("edit") || methodName.startsWith("confirm") || methodName.startsWith("extend") || methodName.startsWith("transfer")) return "UPDATE";
        if (methodName.startsWith("delete") || methodName.startsWith("remove")) return "DELETE";
        if (methodName.startsWith("checkIn")) return "CHECK_IN";
        if (methodName.startsWith("checkOut")) return "CHECK_OUT";
        if (methodName.startsWith("cancel")) return "CANCEL";
        if (methodName.startsWith("login")) return "LOGIN";
        return "OTHER";
    }

    private String getEntityType(ProceedingJoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        if (className.contains("Reservation")) return "Reservation";
        if (className.contains("Room")) return "Room";
        if (className.contains("CheckIn")) return "CheckIn";
        if (className.contains("User") || className.contains("Auth")) return "User";
        if (className.contains("Review")) return "Review";
        if (className.contains("Favorite")) return "Favorite";
        return "Other";
    }

    private Long getEntityId(ProceedingJoinPoint joinPoint) {
        Object[] args = joinPoint.getArgs();
        for (Object arg : args) {
            if (arg instanceof Long) {
                return (Long) arg;
            }
        }
        return null;
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String ip = request.getHeader("X-Forwarded-For");
                if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getHeader("Proxy-Client-IP");
                }
                if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                    ip = request.getRemoteAddr();
                }
                return ip;
            }
        } catch (Exception e) {
            // ignore
        }
        return "unknown";
    }
}
